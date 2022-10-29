import { Field, InputType } from '@nestjs/graphql';
import { IsJWT, IsNotEmpty } from 'class-validator';

@InputType()
export class GoogleLoginInput {
  @Field(() => String, {
    description: 'フロントエンドのリクエストで発行されたGoogleのcredential（JWT）',
  })
  @IsNotEmpty()
  @IsJWT()
  credential!: string;
}
