---
title: 'GitHubの複数アカウントをコマンドから操作しよう'
date: '2019-10-16'
display: home
tags:
  - GitHub
  - CLI
categories:
  - Programming
image: https://www.blog.danishi.net/wp-content/uploads/2019/05/github-logo_hub2899c31b6ca7aed8d6a218f0e752fe4_46649_1200x1200_fill_box_center_2.png
---

# はじめに

GitHub の使っていたアカウントのレポジトリがぐちゃぐちゃになってしまって何が何だかわからない！
って事で Git の練習も兼ねてサブアカウントを作ってコマンドから両方操作できるようにしてみようと思った次第です。

## サブアカウントを作ろう

Github で普通にサブアカウントを作りました。

## ssh 認証鍵を作ろう

`ssh-keygen -t rsa -b 4096 -C "your_email@example.com"` => ssh キーを生成 ( `-t`:鍵のタイプ。 `-b`:鍵の長さ。デフォルトは 2,048bit だが Github は安全性の高い 4,096bit を推奨している。`-C`:コメント )

`ls ~/.ssh/id_rsa_github*` => 生成した鍵の確認

`chmod 600 ~/.ssh/id_rsa_github` => 秘密鍵(.pub がついてない方)のパーミッションを変更

`vi ~/.ssh/config` => ssh のコンフィグファイルに以下のように記述する

```
Host github-sub
  HostName github.com
  IdentityFile ~/.ssh/sub_rsa
  User git
  Port 22
  TCPKeepAlive yes
  IdentitiesOnly yes

Host github
  HostName github.com
  IdentityFile ~/.ssh/main_rsa
  User git
  Port 22
  TCPKeepAlive yes
  IdentitiesOnly yes
```

`ssh -T <HOST>` => ssh 接続できているかの確認

<img width="100%" alt="スクリーンショット 2019-10-08 10 24 24" src="https://user-images.githubusercontent.com/55518345/66364083-14491200-e9bb-11e9-9e58-a74a26f5567c.png">

## Git のコンフィグファイルを編集しよう

`vi ~/.bashrc` => bash の設定ファイルを vim で開きます。

`iキー`を入力してインサートモードにしてから

以下を.bashrc の中に追記してください。

```
function tomain() {
  git config --global user.name "<MAIN_ACCOUNT>"
  git config --global user.email "<MAIN_ADDRESS>"
}

function tosub() {
  git config --global user.name "<SUB_ACCOUNT>"
  git config --global user.email "<SUB_ADDRESS>"
}
```

`escキー` => `:wq`で保存です。

次に.bashrc 内記述を反映させるために`source ~/.bashrc`コマンドを実行してください。

これで、

`tomain` => メインアカウントに切替え
`tosub` => サブアカウントに切替え

コマンドでアカウント切替えができるようになりました。

## Github で鍵を設定しよう

`setting` => `SSH and GPG keys` => `New SSH key`

中に`open ~/.ssh`で確認できる、
`.pub`がついているファイルをテキストエディタ等で開いてコピーペーストしてください。

## 複数アカウントによる問題点

1. `git init`
2. `git add <ファイル名>`
3. `git commit -m "<コメント>"`
4. `git remote add origin <URL(https://github.com/<アカウント名>/<レポジトリ名>.git)>`
5. `git push -u origin master`

複数アカウントがあると、これではエラーになります。
( ssh のコンフィグファイルがしたに記述した方を優先的に使用するからです。 )
そこで、

1. `git init`
2. `git add <ファイル名>`
3. `git commit -m "<コメント>"`
4. `git remote add origin git@github(-sub):<URL(<アカウント名>/<レポジトリ名>.git)>`
5. `git push -u origin master`

これで解決です。

## 参考サイト

・ [今日からはじめる GitHub](https://employment.en-japan.com/engineerhub/entry/2017/01/31/110000)

・ [複数の git アカウントを使用する場合](https://qiita.com/yamataku29/items/4744c9c70ad793c83b82)
