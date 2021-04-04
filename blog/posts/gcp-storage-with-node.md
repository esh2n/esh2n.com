---
title: 'GCP CloudStorageをNode.jsから操作するメモ'
date: '2021-4-4'
display: home
tags:
  - Node.js
  - TypeScript
  - GCP
categories:
  - Programming
image: https://user-images.githubusercontent.com/55518345/113503475-0ef76400-956d-11eb-84c7-06b519da4f9a.png
---

GCPのCloud Storageに関する公式ドキュメントがいまいちわかりにくかったのでメモ。

<div align='center'>
  <img src="https://user-images.githubusercontent.com/55518345/113503475-0ef76400-956d-11eb-84c7-06b519da4f9a.png" style="width: 600px">
</div>

## 🐵 やりたいこと

FirestoreのバックアップデータをCloud Storage上に保存しているが不必要になったものを自動的に消したい。</br>
Cloud Functionsのスケジューラにトリガーは任せるとしてローカルで消せるか試す。

```
npm install --save @google-cloud/storage
```

[GCP公式ドキュメント](https://cloud.google.com/storage/docs/deleting-buckets?hl=ja#storage-delete-bucket-nodejs)

### 👉 やり方

上記のサンプルのやり方だと認証情報を入れてないので、</br>
Storageインスタンス作成時に入れてあげる。</br>
例えばalbum bucketを作ってその中に2021-4-4フォルダを作ってその中に写真があるとすると、

```ts
import { Storage } from '@google-cloud/storage';
const keyName = `my-key.json`;
const projectId = 'my-project-id';
const bucketName = 'album';
const storage = new Storage({ projectId: projectId, keyFile: require(`path/to/service-account-key/${keyName}`) });
const bucket = storage.bucket(bucketName);

async function deleteFile() {

  await bucket.deleteFiles({
    prefix: '2021-4-4'
  })
  console.log(bucket);

  console.log(`${bucketName} deleted`);
}

deleteFile().catch(console.error);
```

これで2021-4-4フォルダごと削除できる。
サービスアカウントキーはGCP コンソール上「IAMと管理」から発行してダウンロードしてくる。

## 📌 終わりに
今回はCloud FunctionsからGCP CloudStorageを操作したいのでNode.Jsを使ったが、</br>
ローカルで完結する場合はgsutilなどを使ってシェルスクリプト組む方がいいと思う。