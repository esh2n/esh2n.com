---
title: '2020年版! 私のターミナル環境'
date: '2020-9-17'
display: home
tags:
  - CLI
  - Vim
  - Tmux
  - Shell
categories:
  - Programming
image: https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/489303/7744782f-d2c3-25b4-a1b3-a0dfd055cc30.png
---

# はじめに

ターミナル周りのカスタマイズが好きなのでちょこちょこ弄ってたのですが、
自分が忘れないためにもとりあえず現在の状態を公開します。

![terminal](https://user-images.githubusercontent.com/55518345/93455768-ba193680-f917-11ea-97ea-90afbd3620b3.png)

## ターミナルは iTerm2

macOS なら一択かな？
設定が細かくできるのでおすすめです。

## シェルは zsh

カスタマイズ好きならこれかな？と安直に決めました。
`fish`あたりも面白そうなのでいずれ試してみたい。

## zsh のプラグイン管理ツールは zplugin(zinit)

最初は oh-my-zsh で zplug に行って zplugin に落ち着いた感じです。
動作がとにかく速いのとプラグインの遅延ロードが便利です。

## テーマは spaceship-prompt

絵文字で華やかにしたいのでこちらを採用。
飽きたらすぐ変えます。

[https://github.com/denysdovhan/spaceship-prompt](https://github.com/denysdovhan/spaceship-prompt)

## テキストエディタは neovim

普段は VSCode を使うことが多いですがやっぱり Vim には憧れがあります。
基本操作は覚えたいので無理やり使ったりしてます。

oni という折衷案もありますがやっぱり neovim。

## vim のプラグイン管理は dein.vim

知り合いの vimmer にお勧めされたので・・・。
エラーが出たら 🥺 ぴえん出るところがお気に入り。

![neovim](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/489303/03dff0bf-672c-6207-139d-5a04003046b5.png)

## pane 管理は TMUX

シェルをマルチで起動したりセッションを保存したりできるすごいやつ。
パソコンをしょっちゅう再起動するのでその都度ターミナルのレイアウト揃えたりするのめんどくさくて導入しました。

## TMUX のプラグイン管理は tpm

「セッション保存 tmux」で検索したら出てきたので使ってます。

- `プレフィックス + Ctrl + s`で保存
- `プレフィックス + Ctrl + r`でリストア

## コンフィグ周りのファイル管理は dotfiles

PC 買い替えなどでいちいち設定するのも面倒なので GitHub 上で管理してます。

https://github.com/shunyaendoh1215/dotfiles

## 終わりに

大雑把に紹介したので細かく紹介したいと思います。そのうち

Golang 製のツール peco やら ghq の関数だったりも紹介したいなあ。
