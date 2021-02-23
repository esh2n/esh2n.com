---
title: 'Webpackでマイクロフロントエンド入門'
date: '2021-2-23'
display: home
tags:
  - MicroServices
  - Frontend
  - React
  - Vue.js
  - Webpack
categories:
  - Programming
image: https://user-images.githubusercontent.com/55518345/108818400-a8416b00-75fc-11eb-968a-465b6e9b6164.png
---

今回はマイクロフロントエンドについてまとめます。<br/>

<div align='center'>
  <img src="https://user-images.githubusercontent.com/55518345/108818400-a8416b00-75fc-11eb-968a-465b6e9b6164.png" style="width: 600px">
</div>

## 🐵 マイクロフロントエンド って?

マイクロサービスの考えをフロント側にも広げたもの。<br/>
[こちら](https://micro-frontends-japanese.org/)で詳しく言及されているが、<br/>
フロントエンド側の UI を単独のアプリで管理するのではなくコンポーネント単位、<br/>
プロジェクト単位で区切ることでフロントエンド層の肥大化を防ぐ。<br/>
新しい feature フラグメント(ページ、コンポーネント)を作る際にそのチームで選定する技術が既存のコードに依存しないものにする。<br/>
<br/>
Header などの共通部分を React で、新たにイベントページを作る際に Vue.js でのような柔軟なフロント層を実現する。<br/>

### 👉 やり方

実際のやり方としてはいくつかあります。

1. サーバーサイドで Html を描画する際にコンテナサーバー経由で各フロントサーバーにリクエストを送り合体する
2. npm ライブラリとしてフラグメントを export+import する
3. JavaScript 経由でランタイム時に統合する

2 に関してはフラグメントの更新が入った時にコンテナ側の更新が必要 -> 静的なものだったら良さそう<br/>
3 が柔軟に使えそうで、Webpack を用いて重複ライブラリを多重ロードしないように設定したりできる<br/>

### 🗒 解説

container/webpack.config.js ファイルにて

```js
	mode: 'development',
	devServer: {
		port: 8080,
		historyApiFallback: {
			index: 'index.html'
		}
	},
	plugins: [
		new ModuleFederationPlugin({
			name: 'container',
			remotes: {
				header: 'header@http://localhost:8081/remoteEntry.js',
			},
			shared: packageJson.dependencies
		}),
	]
```

header/webpack.config.js ファイルにて

```js
	mode: 'development',
	devServer: {
		port: 8081,  // port変える
		historyApiFallback: {
			index: 'index.html'
		}
	},
	plugins: [
		new ModuleFederationPlugin({
			name: 'header',
			filename: 'remoteEntry.js',
			exposes: {
				'./Header': './src/bootstrap'
			},
			shared: packageJson.dependencies
		}),
		new HtmlWebpackPlugin({
			template: './public/index.html'
		})
	]
```

今回 container 側は React にしています。<br/>
container から header を読み込むには header 側からマウント用のメソッドを提供してあげる必要があります。

```js
const mount = (el) => {
  ReactDOM.render(<App history={history} />, el);
};

if (process.env.NODE_ENV === 'development') {
  const devRoot = document.querySelector('#header-dev-root');

  if (devRoot) {
    mount(devRoot);
  }
}

export { mount };
```

これで header 側は独立して開発ができ、container 側にも mount メソッドを提供できます。<br/>
container 側ではこんな感じで header を import して使います。

```js
import { mount } from 'header/Header';

export default () => {
  const ref = useRef(null);

  useEffect(() => {
    mount(ref.current);
  });

  return <div ref={ref} />;
};
```

## 📌 終わりに

少し前に話題になったみたいで気になったので動かしてみました。<br/>
Webpack の ModuleFederation を使うと結構シンプルに実装できていい感じです。
