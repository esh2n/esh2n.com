---
title: '【Flutter】FCMでプッシュ通知を送る際のOS毎の注意点'
date: '2020-11-4'
display: home
tags:
  - Flutter
  - Firebase
  - TypeScript
  - Notification
categories:
  - Programming
image: https://user-images.githubusercontent.com/55518345/98099391-d9255500-1ed2-11eb-9056-5d4b813c7067.png
---

こんにちは、都内スタートアップにて、Flutter x Firebaseを用いて
エンジニアインターンをしている遠藤([@shunyaendoh1215](https://twitter.com/shunyaendoh1215))と申します。

今回は、`FCM(Firebase Cloud Messaging)`のプッシュ通知を行う際に詰まった点を紹介します。

<div align='center'>
  <img src="https://user-images.githubusercontent.com/55518345/98099391-d9255500-1ed2-11eb-9056-5d4b813c7067.png" style="width: 600px">
</div>

FlutterでFCMを制御する方法は[こちら](https://note.com/welchi/n/n649728c5574d)のnoteの記事がわかりやすいかと思います。

# 🙅‍♀️ 問題点

当初このような形でCloud Functionsからプッシュ通知を実装していましたが、
一見うまくいっているように見えますが以下の問題が発生しておりました。

```ts
const options = {
  priority: "high",
};
const payload: admin.messaging.MessagingPayload = {
  notification: {
    title: message.title,
    body: message.body,
    click_action: "FLUTTER_NOTIFICATION_CLICK",
    badge: message.badgeNum,
    sound: "default",
  },
};
await admin.messaging().sendToDevice(message.fcmToken, payload, options);
```

## 🤖 Android

1. 通知トレイからアプリを起動すると`notification ペイロード`が空っぽになる。
2. 画面上部に通知を表示させたい。(`Heads-up通知`)

画像は弊アプリ開発中のものですが、メッセージがきたのをトリガーとし、アプリ内でダイアログを表示するよう実装しております。
通知トレイからアプリを立ち上げると、空っぽのダイアログが表示されてしまいます。

<div align='center'>
  <img src="https://user-images.githubusercontent.com/55518345/97823357-1388c980-1cfc-11eb-8b65-7c5d62b19ab3.png" style="width: 200px">
</div>

また、チャット機能があるので、他アプリを起動している際にも画面上部に通知を表示させたいです。
<div align='center'>
  <img src="https://developer.android.com/images/ui/notifications/heads-up_2x.png?hl=ja" style="width: 200px">
</div>

こんな感じに。(以下`Heads-up通知`と表記します)

## 🍎 iOS

1. 通知トレイからアプリを起動すると２度メッセージが表示される

アプリを完全に落とした状態で通知トレイから起動すると、同じメッセージのダイアログが２度表示されてしまいます。

# 🙆‍♀️ 解決策と注意点

## 🤖 Android

### 1. `onResume`, `onLaunch`をトリガーとする場合Payloadには`data`属性も送らないといけない。

> バックグラウンドにある場合、アプリは、通知トレイで[notification]ペイロードを受け取り、ユーザーが通知をタップしたときにのみ[data]ペイロードを処理します。

[出典: 公式ドキュメント](https://firebase.google.com/docs/cloud-messaging/concept-options)

つまり[data]ペイロードがないと通知トレイからタップした際に空っぽのデータが読みこまれるので、
空っぽのダイアログが表示されていた。

先のFunctionsのペイロードをこう変更したところ問題点①はクリアです。

```ts
const options = {
  priority: "high",
};
const payload: admin.messaging.MessagingPayload = {
  notification: {
    title: message.title,
    body: message.body,
    click_action: "FLUTTER_NOTIFICATION_CLICK",
    badge: message.badgeNum,
    sound: "default",
  },
  // 以下追加
  data: {
    title: message.title,
    body: message.body,
  },
};
await admin.messaging().sendToDevice(message.fcmToken, payload, options);
```

### 2. Heads-up通知を行うには通知チャンネルの設定をしっかりする。

> Android 8.0（API レベル 26）以降、通知はすべてチャネルに割り当てる必要があります。チャネルごとに、そのチャネルのすべての通知に適用される表示と音声の動作を設定することができます。

[出典: 公式ドキュメント](https://developer.android.com/training/notify-user/channels?hl=ja)

とのことで、FCMがデフォルトで作る通知チャンネルだとHeads-up通知の許可がオンになってないようでした。
画像にある`その他`の通知チャンネルがデフォルトのものですが、ユーザーが自発的にポップアップのトグルをオンにしないと
Heads-up通知はきません。
また再インストール時などにはまた設定をしないといけないようです。

<div align='center'>
  <img src="https://user-images.githubusercontent.com/55518345/97857135-9df31c80-1d40-11eb-9c6e-1914b3117795.png" style="width: 1000px">
</div>


方法としては以下があります。
1. デフォルト通知チャンネルの設定を`AndroidManifest.xml`に追記する。
2. [flutter_local_notifications](https://pub.dev/packages/flutter_local_notifications)を利用する。
3. Kotlinネイティブコードからチャンネルを作成する。

1は単純に理解が足りなかったのか、Flutterでは動かなかったので断念。
2は新規プロジェクトでは問題ない選択ですが、今回だと機能過多と判断し、不採用です。

今回はKotlinのネイティブコードを呼び出して通知チャンネルを作成しました。

```kotlin
package com.example   // 自身のプロジェクトコード(ユニークキー)を入れてください
import androidx.annotation.NonNull
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel
import android.content.Context
import android.content.ContextWrapper
import android.content.Intent
import android.content.IntentFilter
import android.os.Build.VERSION
import android.os.Build.VERSION_CODES
import android.app.NotificationManager;
import android.app.NotificationChannel;
import android.net.Uri;
import android.media.AudioAttributes;
import android.content.ContentResolver;

class MainActivity: FlutterActivity() {
  private val CHANNEL = "com.example/channel" // チャンネルの名前

  override fun configureFlutterEngine(@NonNull flutterEngine: FlutterEngine) {
    super.configureFlutterEngine(flutterEngine)
    MethodChannel(flutterEngine.dartExecutor.binaryMessenger, CHANNEL).setMethodCallHandler {
      // FCMService()からのinvoke()
      call, result ->
      if (call.method == "createNotificationChannel"){
        val argData = call.arguments as java.util.HashMap<String, String>
          val isCompleted = createNotificationChannel(argData)
          if (isCompleted == true){
              result.success(isCompleted)
          }
          else{
              result.error("Error Code", "Error Message", null)
          }
      } else {
        result.notImplemented()
      }
    }

  }
    // NotificationChannelの作成
    private fun createNotificationChannel(mapData: HashMap<String,String>): Boolean {
        val isCompleted: Boolean
        if (VERSION.SDK_INT >= VERSION_CODES.O) {
	　  // Flutter側からの値
            val id = mapData["id"]
            val name = mapData["name"]
            val descriptionText = mapData["description"]
            val importance = NotificationManager.IMPORTANCE_HIGH
            val myChannel = NotificationChannel(id, name, importance)
            myChannel.description = descriptionText
            val notificationManager = getSystemService(NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(myChannel)
            isCompleted = true
        }
        else{
            isCompleted = false
        }
        return isCompleted
    }
}
```

Flutter側ではネイティブコードを`MethodChannel`からinvokeします。

```dart
  Future<void> createNotificationChannel() async {
    const _channel = sevices.MethodChannel('com.example/channel');
    const channelMap = {
      'id': 'SAMPLE_CHANNEL', // FCMからこの名前で呼び出す
      'name': 'サンプルアプリ', // エンドユーザーが設定でみる名前
      'description': 'サンプルアプリの通知です',
    };
    try {
      // kotlin側'MainActivity.kt'を呼び出し
      await _channel.invokeMethod('createNotificationChannel', channelMap);
    } catch (e) {
      print('error in FCM.createNotificationCannel(): ' + e.toString());
    }
  }
```

出来たチャンネルはこんな感じです。
ちゃんとポップアップがオンになってそうです。
<div align='center'>
  <img src="https://user-images.githubusercontent.com/55518345/97860475-8c604380-1d45-11eb-8eda-809e17a6cdfe.jpg" style="width: 200px">
</div>

最後にFunctions側で、`Channel ID`を指定します。

```ts
const options = {
  priority: "high",
};
const payload: admin.messaging.MessagingPayload = {
  notification: {
    title: message.title,
    body: message.body,
    click_action: "FLUTTER_NOTIFICATION_CLICK",
    badge: `message.badgeNum,
    sound: "default",
    android_channel_id: 'SAMPLE_CHANNEL'
  },
  data: {
    title: message.title,
    body: message.body,
  },
};
await admin.messaging().sendToDevice(message.fcmToken, payload, options);
```

## 🍎 iOS

### 1. アプリがkillされている場合通知から立ち上げるときは`OnResume`, `OnLaunch`両方トリガーされる。

[こちら](https://github.com/FirebaseExtended/flutterfire/issues/3331#issuecomment-679600146)のissueでのコメントが参考になりました。

つまり弊アプリを例に出すと、アプリが完全に閉じている際に通知トレイなどから立ち上げると、

> ~さんがいいねしました。

というダイアログが２回表示されてしまいます。
同じ内容の通知が`onResume`, `onLaunch`からこないように監視する必要が出てきます。

ダイアログ表示のメソッドにて、以前の通知と被る場合はスルーするようにしました。

```dart
  // iOSでアプリkill時にOnResumeとOnLaunchが同時にトリガーされる問題を監視
  if (Theme.of(context).platform == TargetPlatform.iOS &&
      (trigger == 'onLaunch' || trigger == 'onResume') &&
      notification == lastNotification) return null;
```

# 📌 終わりに

改めて一次ソースの大切さと困ったらGitHubのissue見れば同じ問題抱えている人がいるんだなあとしみじみ思いました。

今回紹介した内容がもし間違っていたら、Twitter等でメッセージください。

(弊社、カルチャというゲームコミュニティアプリを作成しています。副業でもフルタイムでもFlutterエンジニアを募集しているので、興味ある方は[こちら](https://twitter.com/rafe_kun)からDMください！)

