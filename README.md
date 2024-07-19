# LineでGoogleカレンダーに登録
自然言語でGoogleカレンダーに予定を登録できるLine公式アカウントですです。

### メッセージサンプル
テスト株式会社の山田さんと生成AIについて、7/24の13:00から1時間、品川で打ち合わせ

---

## デモ画面



https://github.com/user-attachments/assets/50116d4a-c30c-4f33-9502-0663f1778521



---

## 技術スタック
言語: TypeScript
フレームワーク: Express
LLM: OpenAI

---

## Line登録

---

## 使い方

### 環境変数登録

```.env
OPEN_AI_API_TOKEN=
LINE_CHANNEL_SECRET=
LINE_ACCESS_TOKEN=
GOOGLE_CLIENT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_PROJECT_ID=
```

---

## 主要ディレクトリとファイルの説明

<details><summary>ディレクトリ構成</summary>

```text
├── Makefile
├── database.json
├── migrations
│   ├── 20240507030810-create-table-user.js
│   └── 20240507034654-delete-user-name-table-user.js
├── nodemon.json
├── package-lock.json
├── package.json
├── src
│   ├── application
│   │   └── useCase
│   │       ├── authUseCase
│   │       │   ├── loginUseCase.ts
│   │       │   └── signUpUseCase.ts
│   │       ├── index.d.ts
│   │       ├── line
│   │       │   ├── followUseCase
│   │       │   │   └── followUseCase.ts
│   │       │   ├── imageUseCase
│   │       │   │   └── imageUseCase.ts
│   │       │   ├── messageUseCase
│   │       │   │   └── messageUseCase.ts
│   │       │   └── postBackUseCase
│   │       │       └── postBackUseCase.ts
│   │       └── userUseCase
│   │           └── allUser.ts
│   ├── di
│   │   └── index.ts
│   ├── domain
│   │   ├── interface
│   │   │   ├── externals
│   │   │   │   ├── googleCalenderExternal.ts
│   │   │   │   ├── jwtTokenExternal.ts
│   │   │   │   ├── lineBotExternal.ts
│   │   │   │   └── llmExternal.ts
│   │   │   └── repositories
│   │   │       └── userRepositoryInterface.ts
│   │   ├── models
│   │   │   ├── calenderModel
│   │   │   │   ├── calenderEntity.ts
│   │   │   │   ├── dateTimeEntity.ts
│   │   │   │   ├── description.ts
│   │   │   │   ├── endDateTime.ts
│   │   │   │   ├── location.ts
│   │   │   │   ├── startDateTime.ts
│   │   │   │   ├── summary.ts
│   │   │   │   └── timeZone.ts
│   │   │   └── userModel
│   │   │       ├── email.ts
│   │   │       ├── password.ts
│   │   │       ├── salt.ts
│   │   │       ├── session.ts
│   │   │       └── userEntity.ts
│   │   └── services
│   ├── envs
│   │   └── config.ts
│   ├── index.ts
│   ├── infrastructure
│   │   ├── datastore
│   │   │   ├── db.ts
│   │   │   ├── dto
│   │   │   │   └── user.ts
│   │   │   ├── models
│   │   │   │   └── User.ts
│   │   │   └── repositoryImpl
│   │   │       └── UserRepository.ts
│   │   └── external
│   │       ├── google
│   │       │   └── calender
│   │       │       └── googleCalenderExternal.ts
│   │       ├── jwtTokenExternal
│   │       │   └── jwtToken.ts
│   │       ├── line
│   │       │   ├── lineBotExternal.ts
│   │       │   └── messageBuilder
│   │       │       ├── flexMessageBuilder.ts
│   │       │       └── textMessageBuilder.ts
│   │       └── llm
│   │           ├── gpt
│   │           │   └── chatGptExternal.ts
│   │           └── llmResponse.ts
│   └── presentation
│       └── api
│           └── server
│               ├── controller
│               │   ├── lineWebHookController.ts
│               │   └── userController.ts
│               ├── middleware
│               │   └── index.ts
│               └── router
│                   ├── implument.ts
│                   └── index.ts
└── tsconfig.json

41 directories, 53 files
```

</details>

### migrations/
データベースマイグレーションファイル

### src/
メインのソースコード

### application/
アプリケーションのビジネスロジック

### domain/
ドメインモデルと関連インターフェース

### infrastructure/
外部サービスとの連携、データストア

### presentation/
APIエンドポイントとコントローラー


### Makefile
プロジェクトのビルドと管理用コマンド

### package.json
プロジェクトの依存関係と設定

### tsconfig.json
TypeScriptの設定ファイル
