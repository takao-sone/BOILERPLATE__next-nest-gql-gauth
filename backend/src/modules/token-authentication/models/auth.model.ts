import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TokenAuth {
  @Field(() => String, {
    description: 'アクセストークン',
  })
  accessToken!: string;

  @Field(() => String, {
    description: 'リフレッシュトークン',
  })
  refreshToken!: string;
}
