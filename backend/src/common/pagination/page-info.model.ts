import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PageInfo {
  @Field(() => String, { nullable: true, description: '最初に取得したデータのカーソル' })
  startCursor?: string;

  @Field(() => String, { nullable: true, description: '最後に取得したデータのカーソル' })
  endCursor?: string;

  @Field(() => Boolean, { nullable: true, description: '次のページの可否' })
  hasNextPage?: boolean;

  @Field(() => Boolean, { nullable: true, description: '前のページの可否' })
  hasPreviousPage?: boolean;
}
