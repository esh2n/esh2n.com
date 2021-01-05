---
title: 'Deno + GraphQL + PostgreSQLでJWTを作ろうとして失敗した話'
date: '2021-1-5'
display: home
tags:
  - Deno
  - Node.js
  - TypeScript
  - GraphQL
  - PostgreSQL
categories:
  - Programming
image: https://user-images.githubusercontent.com/55518345/103642949-3d2dcd80-4f97-11eb-967e-77b1d6eefa69.png
---

今回は2020年5月にver1.0.0がリリースされたDeno(ディーノ)に入門しつつ、
GraphQLとPostgreSQLを組み込んでJsonWebTokenを発行する方法に失敗したので後の自分に託すとしてメモを残します。

<div align='center'>
  <img src="https://user-images.githubusercontent.com/55518345/103642949-3d2dcd80-4f97-11eb-967e-77b1d6eefa69.png" style="width: 600px">
</div>

## 🦕 Denoって?

> A secure runtime for JavaScript and TypeScript.(公式原文)

`Deno`はJavaScript/TypeScriptのランタイム(実行環境)です。
`Node.js`とよく比較されますが製作者が同じライアン・ダールで
`Node.js`における設計ミスや後悔している点を修正したものらしいです。
DenoはNodeのアナグラムになっています。

### 👉 Denoの特徴

1. `Deno has top-level async functionality.`

Node.js実行環境だと普通、以下のようにasync関数内でawaitを使用します。

```ts
async function hoge() {
  await fuga()
}

await fuga()  // error!
```

Denoだとasync関数で囲む必要はありません。

2. `Deno uses ECMAScript6 syntax.`

厳密には1.のtop-level asyncもES6のシンタックスを使っているからなのですが、
Node.jsがCommon.jsのシンタックスを利用しているのに対し、
DenoはES6のシンタックスを使っています。

require()/module.exportsだったりexport/importだったりが内包するコードがなくなります。

3. `TypeScript is available by default.`

Node.jsでは`ts-node`等で実行するか、一度コンパイルを挟んでからjsファイルを実行
というのが当たり前だったのですが、Denoではデフォルトでtsファイルを実行できます。
コンパイルはDeno側で勝手にしてくれるので、何も考える必要はありません。

4. `Deno requires permissions for any access.`

Denoはセキュリティに厳格なランタイムです。
実行時にファイルの読み書きの許可がないと使えなかったりネットの許可がないとアクセスできなかったりします。

5. `Deno imports modules by using URL.`

Deno実行環境で外部モジュールを使うには`npm`を使う必要はありません。
例えば`dotenv`を使うなら以下のようにします。

```ts
index.ts
export { config } from 'https://deno.land/x/dotenv@v0.5.0/mod.ts'

const { NAME } = config()
console.log(NAME)  // shunya

.env
NAME="shunya"
```

つまりpackage.jsonがいらなくなり依存関係の煩わしい問題が解消されます。
また、TypeScriptのサポートがあるので拡張子.tsのままimportしています。

実行時にモジュールのインストールが行われ、一度使われたモジュールはキャッシュされます。

6. `Deno has formatter and test-runner by default.`

Denoにはテストランナーとフォーマッタが含まれています。
それぞれ以下で実行できます。

- `deno fmt`
- `deno test`

テストコードは、以下のように書きます。

```ts
Deno.test("hoge", () => {
  ...
})
```

## ✋ 実際に使ってみる

今回はDenoでWebサーバーをたててGraphQL PlayGroundからPostgreSQLに保存と確認を行います。

```ts
index.ts

import { Application, Router } from "https://deno.land/x/oak@v6.0.2/mod.ts";
import { GraphQLService } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";

const typeDefs = gql`
type User {
  firstName: String
  lastName: String
}

input UserInput {
  firstName: String
  lastName: String
}

type ResolveType {
  done: Boolean
}

type Query {
  getUser(id: String): User
}

type Mutation {
  setUser(input: UserInput!): ResolveType!
}
`;

const resolvers = {
  Query: {
    getUser: (parent: any, { id }: any, context: any, info: any) => {
      console.log("id", id, context);
      if(context.user === "hoge") {
        throw new GQLError({ type: "auth error in context" })
      }
      return {
        firstName: "fuga",
        lastName: "fugafuga",
      };
    },
  },
  Mutation: {
    setUser: (parent: any, { input: { firstName, lastName } }: any, context: any, info: any) => {
      console.log("input:", firstName, lastName);

      await client.connect();
      await client.query(`INSERT INTO users(first_name, last_name) VALUES('${firstName}', '${lastName}') RETURNING id, first_name, last_name`)
      return {
        done: true,
      };
    },
  },
};

const GraphQLService = await applyGraphQL<Router>({
  Router,
  typeDefs: typeDefs,
  resolvers: resolvers,
  context: (ctx: RouterContext) => {
    return {user: "hoge"};
  },
});


const app = new Application();

app.use(GraphQLService.routes(), GraphQLService.allowedMethods());
console.log('http://localhost:8000/graphql');

await app.listen({ port: 8000 });

export const client = new Client({
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
  hostname: DB_HOST,
  port: +DB_PORT,
});

```

## 📌 終わりに

JWTをCookiesにセットしてログイン情報を保存したかったのですが、
oak_graphqlが返すcontext.cookiesからcookies.setをしても保存されず諦めました。

まだまだ破壊的なアップデートが繰り返されているので、様子を見つつまたチャレンジしたいと思います。