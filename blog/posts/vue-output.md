---
title: 'vue.jsにFont AwesomeとChart.jsとBootstrap4を導入してみた'
date: '2019-10-16'
display: home
tags:
  - JavaScript
  - Vue.js
  - FontAwesome
categories:
  - Programming
image: https://miro.medium.com/max/874/1*yGrOUQyqX3MBekvP5d-pCA.png
---

# はじめに

vue.js のアウトプットの一環としてポートフォリオサイトを作りました。
その際に躓いた、

- vue.js に Font Awesome を導入
- vue.js に Chart.js の導入
- vue.js に Bootstrap4 の導入

主にこちらについてのお話です。

## 準備

[Laravel で Javascript や CSS を使おう( Laravel Mix )](https://qiita.com/shunyaendoh/items/0db9f1257e2c25801012)
こちらの記事を参考にして node.js をインストールしておきましょう。

## 目次

1. vue-cli のインストール
2. 新規 vue.js プロジェクトの立ち上げ
3. Font Awesome for vue.js のインストールと使用方法
4. Chart.js for vue.js のインストールと使用方法
5. Bootstrap4 for vue.js のインストールと使用方法

## 1. vue-cli のインストール

そもそも vue-cli って何？

> VUE CLI は webpack 4 の上に構築された事前設定済みのビルド設定を提供します。 ( [公式ドキュメント](https://jp.vuejs.org/)より )

つまり vue-cil とは、<font color="red">vue.js 用の雛形作成ツール</font>。
vue.js でプロジェクトを立ち上げようとしたときにスターターキットにして用意してくれます。

って事でインストールです。
ターミナルを開いて、

```
npm install -g @vue/cli
```

こちらのコマンドを実行してください。

次に、

```
vue --version
```

このコマンドでインストールが成功したか確認します。
<img width="100%" alt="スクリーンショット 2019-10-16 0.10.31.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/489303/8ef602ec-b147-d4a9-e40f-3d7fda8f32df.png">

実際の画面です。
このようにバージョンが表示されていれば成功です。

## 2. 新規 vue.js プロジェクトの立ち上げ

プロジェクトを作りたいフォルダの中に移動して、

```
vue create <プロジェクト名>
```

こちらのコマンドで作成です。

なお、上記のコマンドを実行すると
<img width="100%" alt="スクリーンショット 2019-10-16 0.15.40.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/489303/b4d429dc-d0b9-dbfb-79fc-a60b1df4970f.png">
このような画面が出てきますが今回は`default`の状態にし`エンターキー`を押してください。
( `↑↓キー`で移動できます。`)

完了したら以下のような画面になっているはずです。

<img width="100%" alt="スクリーンショット 2019-10-16 7.34.10.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/489303/ba0db433-1a20-9065-79fe-9996df57f88d.png">

```
cd <プロジェクト名>
```

で立ち上げたプロジェクトのディレクトリの中に入ってください。

今回使うエディタは vscode です。

```
code .
```

コマンドで今いるディレクトリを vscode で開きましょう。
( もし`code`コマンドが使えない場合
=> [【Visual Studio Code】コマンドから VS Code を起動できない場合 (Mac 編)](https://qiita.com/ayatokura/items/69c96306e3dee501e19b) )

これでいよいよ FontAwesome を導入する準備ができました。

## 3. Font Awesome for vue.js のインストールと使用方法

まずは[公式 GitHub](https://github.com/FortAwesome/vue-fontawesome)にいきます。

`Installation`の欄をみてみると、

```
npm i --save @fortawesome/fontawesome-svg-core
npm i --save @fortawesome/free-solid-svg-icons
npm i --save @fortawesome/vue-fontawesome
```

このコマンドを打てとあるので、一行ずつ実行してください。
三行一気にではありません。
( \$マークは実際には打たないので消しました。 )

次に、より多くのアイコンを使えるように、

```
npm i --save @fortawesome/free-brands-svg-icons
npm i --save @fortawesome/free-regular-svg-icons
```

こちらのコマンドを一行ずつ実行してください。
これでインストールは完了です。

次に、vscode で`src/main.js`を開いてください。
そこに、

```js:src/main.js
import Vue from 'vue';
import App from './App.vue';

// 追加
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
  FontAwesomeIcon,
  FontAwesomeLayers,
  FontAwesomeLayersText,
} from '@fortawesome/vue-fontawesome';
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('font-awesome-layers', FontAwesomeLayers);
Vue.component('font-awesome-layers-text', FontAwesomeLayersText);
library.add(fas, far, fab);
// 追加ここまで

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
```

上記のように書いてください。

次に`src/App.vue`を開いて`<template>`タグ内に、

```vue:src/App.vue
<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <!-- twitterアイコン -->
    <font-awesome-icon :icon="['fab', 'twitter']" class="text-light" />
    <!-- qiitaアイコン -->
    <font-awesome-layers>
      <font-awesome-icon :icon="['fas', 'square']" class="text-light" />
      <font-awesome-icon
        :icon="['fas', 'search']"
        transform="shrink-1"
        :style="{ color: 'black' }"
      />
    </font-awesome-layers>
  </div>
</template>
```

これで FontAwesome が使えているはずです。

```
npm run serve
```

コマンドを入力して、
`localhost:8001`にアクセスしてください。
以下のようになったら成功です。
<img width="100%" alt="スクリーンショット 2019-10-16 8.17.07.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/489303/99434327-7598-bf65-d329-c58afa185d4f.png">

なお QIITA のアイコンは Font Awesome にはないので、
[Font Awesome で Qiita ロゴっぽいアイコンを表現](https://qiita.com/hkusu/items/fda8d8178dd693f95f3c)
こちらの記事を参考に作りました。

## 4. Chart.js for vue.js のインストールと使用方法

まずは[公式ドキュメント](https://vue-chartjs.org/ja/guide/)を見にいきます。

```
npm install vue-chartjs chart.js --save
```

コマンドでインストールできるようですので実行してください。
今回は`src/components/`内に`DoughnatChart.vue`ファイルを作りました。

```vue:DoughnatChart.vue
<script>
import { Doughnut } from 'vue-chartjs';
export default {
  extends: Doughnut,
  props: {
    chartdata: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      tooltips: {
        enabled: false,
      },
      hover: {
        mode: null,
      },
    },
  }),
  mounted() {
    this.renderChart(this.chartdata, this.options);
  },
};
</script>
```

次に、`src/App.vue`です。

```vue:src/App.vue
<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <!-- twitterアイコン -->
    <font-awesome-icon :icon="['fab','twitter']" class="text-dark"/>
    <!-- qiitaアイコン -->
    <font-awesome-layers>
      <font-awesome-icon :icon="['fas','square']" class="text-dark"/>
      <font-awesome-icon :icon="['fas','search']" transform="shrink-1" :style="{ color: 'white' }" />
    </font-awesome-layers>
    <!-- doughnatchart -->
    <doughnut :chartdata="{datasets: [{backgroundColor:['coral','gray'], data: [75, 25]}]}" class="doughnat"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
// 追加
import Doughnut from './components/DoughnutChart.vue'

export default {
  name: 'app',
  components: {
    HelloWorld,
    // 追加
    Doughnut
  }
}
```

`<script>`タグ内を変更し、`<template>`タグに追記してください。

```
npm run serve
```

コマンドでサーバーを立ち上げ確認しましょう。

<img width="100%" alt="スクリーンショット 2019-10-16 9.57.27.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/489303/0c6706d3-b3e7-9a1b-5fbb-002617ac4f23.png">

無事に Chart.js を導入できましたか？

## 5. Bootstrap4 for vue.js のインストールと使用方法

まずは[公式ドキュメント](https://bootstrap-vue.js.org/)です。

```
vue add bootstrap-vue
```

コマンドでインストールできると書いてあるので実行しましょう。

これで Bootstrap4 は導入完了です。
試しに`src/App.vue`ファイルを開いて、

```
<!-- twitterアイコン -->
<font-awesome-icon :icon="['fab','twitter']" class="text-success"/>
```

`class="text-sccess"`に変更してみましょう。

<img width="100%" alt="スクリーンショット 2019-10-16 12.13.25.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/489303/21b22857-cbbb-4055-4d65-2dff3822cf15.png">

twitter のマークが緑色になりました！

### ちなみに

今回作ったサイトは[こちら](https://esh2n.github.io/Portfolio-vue/)です。

<img width="100%" alt="スクリーンショット 2019-10-15 22.21.32.png" src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/489303/7ea1dc4a-5b2c-23f3-0737-6a904b7cf6ee.png">
