import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export abstract class SampleBaseModel {
  @Field(() => ID, {
    description: 'クライアントアプリケーション側へ表示しても良いID',
  })
  displayedId!: string;

  @Field({
    description: 'データ作成時間',
  })
  createdAt!: Date;

  @Field({
    description: 'データ更新時間',
  })
  updatedAt!: Date;
}
