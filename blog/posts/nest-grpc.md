---
title: 'NestJsでgRPCのClientとServerを実装する'
date: '2021-2-3'
display: home
tags:
  - gRPC
  - NestJs
  - Node.js
  - TypeScript
categories:
  - Programming
image: https://user-images.githubusercontent.com/55518345/106738125-e9c4a300-665a-11eb-9067-96729558c627.png
---

今回は gRPC 入門ということで NestJs で gRPC のサーバーとクライアントを作成します。

<div align='center'>
  <img src="https://user-images.githubusercontent.com/55518345/106738125-e9c4a300-665a-11eb-9067-96729558c627.png" style="width: 600px">
</div>

## 🐵 gRPC って?

[gRPC](https://www.grpc.io/)は Google が開発した RPC フレームワークで
REST API と違って内部で HTTP/2 を使っていることによってデータの受け渡しが高速に行えます。
近年の micro service architecture の流行りによってドメイン, サービスごとにシステムを疎結合するケースが増えています。
gRPC を用いると proto ファイルさえ統一していれば言語の壁なしにサーバとの通信が高速に行えます。

### 👉 とりあえず動かす

今回動かすサンプルコードは[こちら](https://github.com/esh2n/nestjs-grpc)にあります。

まだ Unary ケースしか実装していないので興味がありましたら追加してみてください。

以下コマンドで動かせます。

```sh
# project root
yarn install

# start server
cd server && yarn install
yarn start

# start client
cd client && yarn install
yarn start
```

[http://localhost:3000/hero](http://localhost:3000/hero)にいくとデータが取得できているのが確認できると思います。

### 🗒 解説

まずは proto ファイル

```proto
syntax = "proto3";

package hero;

service HeroService {
 // Unary
 rpc FindOne (HeroById) returns (Hero) {};
}

message HeroById {
 int32 id = 1;
}

message Hero {
 int32 id = 1;
 string name = 2;
}
```

この proto ファイルをベースにいろんな言語用のファイルを自動生成していきます。

すごく余談ですが、
Yahoo の技術ブログや Wantedly の技術ブログに実際のユースケースを乗せてくださっているのでとても参考になりました。
Github actions を利用して特定のブランチに PR を出すとそのブランチ名のプログラミング言語用のファイル生成するように組んでいて
使う側は純粋に開発に集中できる環境作りをされていました。

今回は NestJs 用にコードジェネレートします。
generate.sh を作成していつでも実行できるようにします。

```sh
#! bin/bash

protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto \
  --ts_proto_out=generates/hero \
  --ts_proto_opt=nestJs=true \
  --ts_proto_opt=outputClientImple=true \
  --ts_proto_opt=addGrpcMetadata=true \
  -Iprotos \
  protos/hero.proto
```

生成されたコードにはサーバー、クライアントに必要な interface 群や
メソッドをまとめてくれています。(今回だと finedOne だけ)

server 側 hero.controller.ts

```ts
@Controller('hero')
@HeroServiceControllerMethods()
export class HeroController implements HeroServiceController {
  findOne(data: HeroById, metadata?: Metadata): Promise<Hero> | Hero {
    if (metadata) console.log(metadata);

    return {
      id: data.id,
      name: 'Hi, from server.',
    } as Hero;
  }
}
```

コード生成されているおかげで少ない記述でメソッドを実装できます。
今回だと findOne()呼び出しで Hero オブジェクトが返されます。

client 側 hero.service.ts

```ts
@Injectable()
export class HeroService implements OnModuleInit {
  private heroService: HeroServiceClient;

  constructor(@Inject('HERO_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.heroService = this.client.getService<HeroServiceClient>('HeroService');
  }

  getHero(): Observable<Hero> {
    return this.heroService.findOne({ id: 1 });
  }
}
```

こちらは getHero()呼び出しで先程の findOne()を呼び出しています。

client 側 hero.controller.ts

```ts
@Controller('hero')
export class HeroController {
  constructor(private readonly heroService: HeroService) {}

  @Get()
  call(): Observable<any> {
    return this.heroService.getHero();
  }
}
```

http://localhost:5000/hero に GET リクエストを送ると heroService.getHero()の結果を返します。

## 📌 終わりに

今回はサーバー側も NestJs で実装しましたが、Go や Rust でも挑戦してみたいです。
少しでも gRPC 入門したいけど Go わからんマンの役に立てれば良いです。

今回は BFF として NestJs を使ってみるか考えていたら気づいたら gRPC に興味が沸いてしまい入門しました。
