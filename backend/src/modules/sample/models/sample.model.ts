import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '../../../common/models/base.model';

@ObjectType({ description: 'サンプル用GraphQLモデル' })
export class Sample extends BaseModel {
  @Field(() => String, {
    description: '名前',
  })
  name!: string;
}
