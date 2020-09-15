---
title: 'Google Apps Scriptを使ってSlackBotを作ってみた。'
display: home
date: '2019-11-19'
tags:
  - GAS
  - Slack
  - WebHook
categories:
  - Programming
image: https://images.idgesg.net/images/article/2019/01/slack_logo_wordmark_2019_3x2-100785482-large.jpg
---

# はじめに

> slack で特定の文字に反応してくれる BOT を Google Apps Script( GAS )で作ります。

=>[ランチ候補を post してくれる slackbot を、Google Apps Script で作る](http://dormouse666.hatenablog.com/entry/2018/05/10/203645)

こういうのが作りたい

成果物はこちら、

![sample.gif](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/489303/642014dd-019b-1b71-b3fd-e466abe6b5c0.gif)

## 仕様

- `ルーレット`と送信すると登録した名前から一つ slack に投稿される
- スプレッドシートに名前を登録しておく
- GAS 上でスプレッドシートの情報を読み込み、ランダムに一件取得

## 目次

1. [Google スプレッドシート](https://docs.google.com/spreadsheets/u/0/)にデータ入力
2. [Incoming WebHooks](https://my.slack.com/services/new/incoming-webhook)の設定
3. [Google Apps Script](https://script.google.com/u/0/home)にコード書く + デプロイ
4. [Outgoing WebHooks](https://my.slack.com/services/new/outgoing-webhook)の設定

## 1. Google スプレッドシートにデータ入力

まずは、[Google スプレッドシート](https://docs.google.com/spreadsheets/u/0/)にアクセスします。

`新しいスプレッドシートを作成` => `空白` を選択して新規プロジェクトを立ち上げましょう。

<img width="100%" alt="スクリーンショット_2019-11-19_10_09_43.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/489303/c6f66ae4-6e65-525b-ccda-0081ead17177.png">

そして、スプレッドシート内に次のように記述してください。

<img width="342" alt="無題のスプレッドシート_-_Google_スプレッドシート.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/489303/f2fb4415-33ea-c8d5-3462-46e063010ce6.png">

また、<font color=red>このスプレッドシートの URL は後で使うのでコピーして控えておいてください。</font>

## 2. Incoming WebHooks の設定

まずは、[Incoming WebHooks](https://my.slack.com/services/new/incoming-webhook)にアクセスします。

<img width="100%" alt="Incoming_Webhook___ゲーム部門_Slack.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/489303/73b802f0-5418-1a46-d081-a67d6446afd1.png">

① 自分のワークスペースにログイン
② 投稿したいチャンネルを選択
③ Incoming Webhook インテグレーションの追加

次に、<font color=red>Webhook URL をコピーして控えておきましょう。</font>

<img width="90%" alt="Cursor_と_Incoming_Webhook___Slack_App_ディレクトリ.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/489303/2456d999-b634-9322-22a0-4b72569cd5b2.png">

そして「設定を保存する」を押してください。

## 3. Google Apps Script にコード書く + デプロイ

いよいよコードを書いていきます。
まずは [Google Apps Script](https://script.google.com/u/0/home)にアクセスしてください。

「新しいプロジェクト」 を押して新規プロジェクトを立ち上げます。

<img width="70%" alt="Cursor_と_自分のプロジェクト_-_Apps_Script.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/489303/cd409d4f-8964-84ab-5e7c-08fab5969d79.png">

コード.gs に以下を記述してください。
( 先ほどコピーしておいたスプレッドシートの URL と Webhook URL を使用します。 )

```コード.gs
var SLACK_WEBHOOK = 'https://hooks.slack.com/services/***********/';  // Incomig Webhook URL
var SLACK_CHANNEL = '#*******'; // channel名
var SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/**********';  // スプレッドシートURL
var EMOJI_ICON = ':question:'; // アイコン(slackのスタンプを使っているのでお好みで)
var BOT_NAME = 'ルーレットくん'; // BOTの名前

Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)]
}

function postMessage(message, hookPoint) {
  var payload = {
    "text": message,
    "icon_emoji": EMOJI_ICON,
    "username": BOT_NAME,
    "channel": SLACK_CHANNEL
  }
  var options = {
    "method" : "POST",
    "payload" : JSON.stringify(payload),
    "headers": {
      "Content-type": "application/json",
    }
  }
  var response = UrlFetchApp.fetch(hookPoint, options);

  if (response.getResponseCode() == 200) {
    return response;
  }
  return false;
}

function main() {

  var spreadsheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  var sheet = spreadsheet.getSheets()[0];


  var messageAll = sheet.getRange(2, 1, sheet.getLastRow()-1, 1).getValues(); // getLastRow()は空白の最終行もとって来てしまう
  var messageList = [];
  var message = "";

  for (var i in messageAll) {
     messageList.push(messageAll[i][0]); //textだけ格納
  }
  message += messageList.random();

  message += "、キミに決めた！\n\n\n候補を編集する　→ <" + SPREADSHEET_URL + "|:memo:>";

  postMessage(message, SLACK_WEBHOOK);
}


function doPost(e) {
  if(e.parameter.user_id == "USLACKBOT"){
    return;
  }

// 今回はGAS上でキーワードを設定しているのでOutgoing WebHooksでトリガーの設定は不要
  if(e.parameter.text.match(/ルーレット/)){
    main();
  }
}
```

<img width="100%" alt="SlackApp_と_「」を編集_-_Qiita-2.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/489303/e3f43505-fae1-5bf3-0e1a-d53d21b51713.png">

書き終わったら「公開」ボタンを押してデプロイします。

「公開」 => 「WEB アプリケーションとして導入...」を押してください。

<img width="50%" alt="無題のプロジェクト.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/489303/bca0579e-b126-028e-18d9-5e1eab688058.png">

Project version は「New」です。
Who has access to the app は「Anyone, even anonymous」に設定してください。

設定が終わったら「deploy」を押してください。
( この時ユーザー認証について Google から聞かれる場合がありますが、「許可を確認」を押してください。 )

<img width="50%" alt="無題のプロジェクト-2.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/489303/34572d30-0f36-83a2-c3e4-bfdf1e680734.png">

この、<font color=red>Current web app URL は後で使うのでコピーして控えておいてください。</font>

## 4. Outgoing WebHooks の設定

まずは、[Outgoing WebHooks](https://my.slack.com/services/new/outgoing-webhook)にアクセスしてください。

<img width="100%" alt="Cursor_と_Outgoing_Webhook___Slack_App_ディレクトリ.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/489303/79b21517-8623-1446-8a36-9e4784c96f2a.png">

チャンネル欄はお好みで。
引き金となる言葉は空欄、URL には先ほどコピーした Current web app URL をペーストしてください。

設定が済んだので「設定を保存する」を押してください。

## 最後に

以上で SlackBot の作成が完了です。

`ルーレット`と送信してみてください。

無事に Bot からメッセージが帰って来ましたか？

### 参考にしたサイト

- [Slack Bot を GAS でいい感じで書くためのライブラリを作った](https://qiita.com/soundTricker/items/43267609a870fc9c7453)
- [GAS と Slack ではじめるチャットボット〜初心者プログラマ向け〜](https://qiita.com/yukihirai0505/items/cbb9832d42dc627800fb)
- [Google Apps Script で Slack Bot を作ってみた。(お勉強編)](https://qiita.com/Quikky/items/9de56c049304885a4f4f)
- [ランチ候補を post してくれる slackbot を、Google Apps Script で作る](http://dormouse666.hatenablog.com/entry/2018/05/10/203645)
