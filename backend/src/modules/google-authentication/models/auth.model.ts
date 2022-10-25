import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GoogleTokenAuth {
  @Field(() => String, {
    description: 'アクセストークン',
  })
  accessToken!: string;
}
