import { Field, HideField, ObjectType } from '@nestjs/graphql';

@ObjectType({ isAbstract: true })
export abstract class Base {
  @HideField()
  id!: number;

  @Field({
    description: 'DBへのデータ作成時間',
  })
  createdAt!: Date;

  @Field({
    description: 'DBへのデータ更新時間',
  })
  updatedAt!: Date;
}
