---
title: 'macOS CatalinaにアップデートしてXAMPPが使えなくなった人へ'
date: '2019-10-14'
display: home
tags:
  - XAMPP
  - MacOS Catalina
  - CLI
  - PHP
categories:
  - Programming
image: https://cnet2.cbsistatic.com/img/uku7sSxJf3Y_lnD_KQ2I8RYbdL4=/1092x0/2019/10/07/fc04b95e-1b6f-4ed7-8c1a-be77243b4291/macos-catalina.png
---

# はじめに

「macOS Catalina(ver.10.15)にアップデートしたら XAMPP が起動しない！」って人が周りに何人かいたので、
「<font color="red">これを機に XAMPP を卒業しよう！</font>」って事で記事を書きました。

## XAMPP の何が悪いの？

XAMPP は手軽に PHP のローカル開発環境が作れます。
ボタン一つで Apache サーバーを立ち上げ,
MYSQL とやりとり出来るでしょう。めっちゃ便利です。
でも<font color="red">ダサい！</font>
ターミナルを使ってコマンドで立ち上げた方がかっこいい！
特に悪いところは見つかりません。笑
強いて言えば実践的ではないところですかね？
( 御指南お願いします。 )

## 準備

- `macOS`をアップデートしましょう。 ( おそらくあなたは今ここです。 )
- `XCode`をアップデートしておきましょう。 ( ターミナルで`xcode-select --install`コマンドでインストールできます。 )
- `ターミナル`を開きましょう。 ( iterm2 がおすすめです。 )

## Homebrew をインストールしよう

ターミナル上で、

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

こちらをコピーペーストで実行しましょう。
( 2019/10/14 日現在のコマンドです。[公式サイト](https://brew.sh/index_ja)でインストール欄を確認することをおすすめします。 )

エンターキーを入力してくださいやら mac のパスワードを入力してくださいやら出てきますが指示に従ってください。

インストールが完了したら、

```
brew -v
```

を入力して実行です。 ( Homebrew のバージョンを確認するコマンドです。 )

<img width="100%" alt="スクリーンショット 2019-10-14 12.41.08.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/489303/8ecb66de-a4d6-dfc4-a416-24de7d8557cb.png">

こちらのように出れば成功です。

## Mysql をインストールしよう

次に MYsql を Homebrew を利用してインストールしていきます。 ( 今回使うのは Mysql@5.7 です。 )

ターミナル上で、

```
brew install mysql@5.7
```

と入力して実行してください。

## 実際に使ってみよう

まずは、

```
 echo 'export PATH="/usr/local/opt/mysql@5.7/bin:$PATH"' >> ~/.bash_profile
```

```
source ~/.bash_profile
```

```
mysql.server start
```

と順番に入力して実行してください。
( SUCCESS と出れば成功です。 )

次に、

```
mysql -u root -p
```

上のコマンドを実行してください。
( ユーザー=>ルート, パスワード=>無しという意味です。 )

その後に、`Enter password`と出てパスワードを入力するように促されますが、そのままエンターキーを押してください。 ( 今回はパスワードは無しにしたからです。 )

下の画像は実際の画面です。

<img width="100%" alt="スクリーンショット 2019-10-14 12.51.13.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/489303/c3c0aff3-98bf-123a-d168-e8c853d7161f.png">

## Mysql を操作してみよう

`show databases;` => 今あるデータベースの一覧を表示します。
`create database {データベース名} default character set utf8mb4 collate utf8mb4_unicode_ci;` => データベースを作ります。
`use {データベース名};` => データベースを使います。
`show tables;` => テーブルの一覧を出します。
`select * from {テーブル名};` => テーブルの中身を確認します。

他のコマンドは適宜確認してみてください。

終了するときは、

```
exit
```

してから、

```
mysql.server stop
```

でサーバーを閉じてください。

### コマンドで操作するのめんどくさい！

`sequel pro`で検索すると幸せになれます。
