# README

## Prisma

### マイグレート手順

- `schema.prisma`の編集
- マイグレーションコマンドの実行
```shell
npx prisma migrate dev
```

### マイグレーションロールバック手順

**データは`seed`か抽出しておくこと**

- 該当のマイグレーションファイルの削除
- マイグレーションのリセット
```shell
npx prisma migrate reset
```
- 該当マイグレーションの再作成
```shell
npx prisma migrate dev
```
- 完了

### データのseed

- `package.json`で実行したいシードファイルに変更
```json
{
  "prisma": {
    "seed": "ts-node prisma/seed_exercises.ts"
  }
}
```
- シードファイル実行
```shell
npx prisma db seed
```
- `package.json`をデフォルトのseedファイルに戻す
```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```
- 完了
