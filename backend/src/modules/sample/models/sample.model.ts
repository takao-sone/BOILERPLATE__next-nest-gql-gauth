import { Field, ObjectType } from '@nestjs/graphql';
import { SampleBaseModel } from '../../../common/models/sample-base.model';

@ObjectType({ description: 'サンプル用GraphQLモデル' })
export class Sample extends SampleBaseModel {
  @Field(() => String, {
    description: '名前',
  })
  name!: string;
}
