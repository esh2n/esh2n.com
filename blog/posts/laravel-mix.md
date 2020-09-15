---
title: LaravelでJavascriptやCSSを使おう( Laravel Mix )
display: home
date: 2019-9-28
tags:
  - Laravel
  - HomeBrew
  - CLI
categories:
  - Programming
image: https://webty.jp/staffblog/wp-content/uploads/2019/08/thumbnail_laravel-660x500.png
---

# はじめに

> Laravel を学んで「一通りデータベースとの CRUD 処理はもう出来た！」という人のための記事。
> 次はそのサイトに Javascript や CSS を使ってみよう。
> 今回は Javascript でアラートを表示させてみます。

## Laravel Mix とは

> Laravel Mix は多くの一般的な CSS と JavaScript のプリプロセッサを使用し、Laravel アプリケーションために、構築過程を Webpack でスラスラと定義できる API を提供しています。([Laravel 公式リファレンス](https://readouble.com/laravel/5.5/ja/mix.html))

<font color=red>何言ってんだ・・・？</font>
僕もわかりません笑
簡単にいうと、

> Laravel Mix は js ファイルや css(sass)ファイルを Laravel 上で使えるようにしてくれるやつ。
> ( js ファイルや sass ファイルをコンパイルして Laravel 上で使えるようにする API )

## インストールと準備

以下をお手元のパソコン君にインストールしてください
・ node.js ([node.js 公式サイト](https://nodejs.org/ja/download/))
・ npm (node.js 用のパッケージマネージャ。Vue.js, React, Bootstrap などがインストール出来ます。Node.js をインストールすれば使えるようになります。)

### インストール方法

今回は以下の２つの方法を紹介したいと思います。

A. CUI を使ったコマンドでのインストール方法( 難易度: 普通 )
B. 公式サイトからインストーラをダウンロードしてくる方法( 難易度: 低い )

<font color= red>僕は A の CUI でのインストール方法をおすすめしています。</font>

### A. CUI でのインストール( Homebrew を使うので Mac のみです )

手順は以下になります。

1. Homebrew のインストール( [Homebrew 公式サイト](https://brew.sh/index_ja.html) )
2. nodebrew のインストール
3. node.js のインストール

#### 1. Homebrew のインストール

まずはターミナル( コンソール画面 )を開きましょう。そこに、

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

こちらを丸々コピーして実行( エンターキー )してください。
インストールは時間がかかるので新たにコマンドは打たず、\$マークが出るまでほうっておきましょう。
( 2019/9/28 現在のコマンドになりますので、[公式サイト](https://brew.sh/index_ja.html)を確認してください。)

無事にインストールが出来たら`brew -v`コマンドを打ってみましょう。( Homebrew のバージョンを確認するコマンドです。 )

<img width="100%" alt="スクリーンショット 2019-09-28 15.03.27.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/489303/1eef30c5-f7df-f11f-5aab-a0435478c146.png">

このように「Homebrew ○.○.○○」と表示されていれば成功です。

#### 2. nodebrew のインストール

Homebrew が無事にインストール出来たので nodebrew をインストールできるようになりました。ターミナル上に、

```
brew install nodebrew
```

こちらを打って実行してください。
このコマンドは Homebrew を使って nodebrew をインストールするコマンドです。

インストールが完了したら`nodebrew -v`コマンドを打ってみましょう。( nodebrew のバージョンを確認するコマンドです。 )

<img width="100%" alt="スクリーンショット 2019-09-28 15.15.12.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/489303/b9a591cc-fae8-1317-073f-ec5ce0babba2.png">

何やらたくさん出てきましたが一番上に「nodebrew ○.○.○」と表示されていれば成功です。 ( なお、他に表示されているのは使い方の例や使えるコマンド集です。いわば説明書ですね。 )

#### 3. node.js のインストール

お待たせしましたやっと node.js がインストール出来ます。
ターミナルは開いていますね？以下を入力して実行してください。

```
nodebrew install-binary stable
```

このコマンドは nodebrew を使って安定版の node をインストールするコマンドです。なお、最新版をインストールしたい場合は、

```
nodebrew install-binary latest
```

としてください。

インストールが完了したら`nodebrew ls`コマンドを実行してください。
このコマンドはインストールされた node のリストを表示するコマンドです。

<img width="100%" alt="スクリーンショット 2019-09-28 15.28.50.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/489303/cc7ca67b-ba10-6b38-c36d-a00ef9c720f3.png">

このように「v○.○.○」と表示されていればインストール成功です。
その下に`current: none`と出ているのはインストールした直後は有効化されていない為です。

そこで、

```
nodebrew use v○.○.○
```

コマンドで有効化します。( ○ はお使いのバージョンを入力してください。 )
もう一度`nodebrew ls`コマンドを実行すると、

<img width="100%" alt="スクリーンショット 2019-09-28 15.27.56.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/489303/800d1597-513c-b36b-1cbb-ddc31b2cc782.png">

インストールしたバージョンの node が設定されました。

##### ＊ node コマンドを使えるように環境 PATH を通す

node が無事にインストール出来ましたがこのままでは node コマンドが使えません。パソコン君に node コマンドを使うための道筋を教えてあげましょう。( お使いの shell が bash の場合 )

```
echo 'export PATH=$HOME/.nodebrew/current/bin:$PATH' >> ~/.bash_profile
```

こちらのコマンドは.bash_profile というファイルに''の中身を追記しているコマンドです。
`source ~/.bash_profile`を実行してください。
このコマンドで再読み込みさせます。
最後に`node -v`コマンドを実行してください。

<img width="100%" alt="スクリーンショット 2019-09-28 15.44.03.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/489303/ba7581a6-5cba-c93f-3486-4986d5df4ee9.png">

このように「v○○.○○.○」と表示されていれば成功です。

### B. 公式サイトからインストーラをダウンロードする方法

手順は以下になります。

1. [公式サイト](https://nodejs.org/ja/download/)で最新版もしくは推奨板のインストーラをダウンロード
2. インストーラをダブルクリックして起動
3. 指示に従ってインストール
4. ターミナルで`node -v`,`npm -v`を打ってみて確認

非常に簡単です。

## Laravel Mix を使ってみよう

「あれ、これなんの記事だっけ？」そう思ったあなた。
大丈夫です。僕も同じことを思っていました。

環境構築は時間がかかるのです。やっと準備が整ったので、
新しく Laravel のプロジェクトを立ち上げましょう。
ターミナルを起動してください。

`mkdir {フォルダ名}`コマンドでフォルダを新規作成してください。
次に、`cd {フォルダ名}`コマンドで作成したフォルダに移動してください。その中で、

```
composer create-project --prefer-dist laravel/laravel {プロジェクト名} 5.7
```

こちらのコマンドを打ってプロジェクトを作成してください。
( 時間がかかるのでしばらく待ちましょう。 )

<img width="100%" alt="スクリーンショット 2019-09-28 16.11.29.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/489303/530c1120-a038-8d90-5426-554d1a29a622.png">

無事に作成が完了すると、「○○○○ successfully」みたいな文字列が表示されて\$マークが現れます。

今回使うエディタは Visual Studio Code です。

`code {プロジェクト名}`コマンドを入力して vscode でプロジェクトを開きましょう。

---

ここからは vscode での操作になります。
vscode 上で SHIFT(↑) + control(^) + backquote(`)を押してください。
vscode でターミナルが使えるようになります。

### npm のインストール

`npm install`コマンドを実行してください。
このコマンドは作成した Laravel のプロジェクトのフィルダ直下に入っている「package.json」を参照してそこに記載されているパッケージをインストールしています。
このコマンドを実行すると Laravel Mix が使えるようになります。

### javascript のファイルを作成

`resources`フォルダに`assets`フォルダを作成してください。
そしてその中にさらに`js`フォルダを作ってください。
その中に`app.js`と`sample.js`を作成してください
(resources<assets<js<app.js,sample.js)

<img width="100%" alt="スクリーンショット 2019-09-28 17.01.32.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/489303/e4df56c6-4b30-c43f-17b7-87b1bbaa74e5.png">

そして、sample.js を開いて以下のように記入してください。

```js:sample.js
alert('CAUTION!!');
```

次に、app.js を開いて以下のように記入してください。

```js:app.js
require('./sample');
```

### webpack.mix.js を編集

作成した Laravel プロジェクトの直下に入っている`webpack.mix.js`ファイルを開いてください。

```js:webpack.mix.js
const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix
  .js('resources/js/app.js', 'public/js')
  .sass('resources/sass/app.scss', 'public/css');

// 以下を追加
mix.js('resources/assets/js/app.js', 'public/js');
```

上記の「以下を追加」の下の部分を追加してください。
これは`resources/assets/js/app.js`の中身を
`public/js`の中に入れる( コンパイル )という意味で、
`public/js`で先ほど書いた app.js を読み込めるということです。
( app.js には sample.js を読み込めるように
`require('./sample')`を記入しているので app.js だけ読み込めれば大丈夫ということです。 )

### sample.blade.php を作成

js ファイルを読み込む準備が出来たので読み込みたいページを作ります。
`resources/views`の中に`sample.blade.php`を作成してください。

次にターミナル上で以下のコマンドを実行してください。
`php artisan make:auth`
すると`views/layouts`フォルダが作成されます。

<img width="100%" alt="スクリーンショット 2019-09-28 17.46.19.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/489303/a72cc74e-b881-2027-1b60-7244a42a7b15.png">

sample.blade.php を開いてください。
そして、以下のように記入してください。

```php:sample.blade.php
@extends('layouts.app')
```

### web.php を編集

`routes`フォルダに入っている`web.php`を開いてください。
以下のように一箇所編集してください。

```php:web.php
<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('sample');  // ここを編集 (welcome->sample)
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
```

### コンパイルとサーバーの立ち上げ

今まで書いてきたコードを適応させるために以下のコマンドを実行してください。
( 時間がかかるのでしばらく待っていてください。 )
`npm run dev`
成功したら以下のように表示されます。
(なお、`npm run dev`は開発環境においてのコンパイル方法で余計な機能が付いてきます。実際にサービスとしてデプロイする場合には`npm run production`コマンドでコンパイルしてください。) <br>
<img width="100%" alt="スクリーンショット 2019-09-28 18.02.27.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/489303/a211ba5c-1fb1-178f-8f9b-8f5c4a0c4923.png">

次にサーバーを立ち上げます。
`php artisan serve`コマンドを実行してください。
<img width="100%" alt="スクリーンショット 2019-09-28 18.05.14.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/489303/6ddfdd79-96fa-e84b-78d6-d4be21b81288.png">

### [http://127.0.0.1:8000](http://127.0.0.1:8000)へアクセス

<img width="100%" alt="スクリーンショット 2019-09-28 18.09.51.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/489303/e645b09e-2e3b-046f-5405-e2b4f002ad42.png">

無事にアラートが表示されましたか？

---

##参考サイト

- [Laravel mix 事始め](https://qiita.com/ryosukes/items/24a556b9e634c183f93b)
- [Node.js と npm インストールとアップデート](https://qiita.com/jaxx2104/items/2277cec77850f2d83c7a)
- [[Laravel 5.6] Laravel 開発で Javascript を書きたいとき（Laravel Mix の使い方とか）](https://qiita.com/u-dai/items/83766b69a0e18488b005)
- [Mac に Node.js をインストール](https://qiita.com/kyosuke5_20/items/c5f68fc9d89b84c0df09)
- [Node.js / npm をインストール (Mac 環境)](https://qiita.com/PolarBear/items/62c0416492810b7ecf7c)
