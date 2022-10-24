import { Field, InputType } from '@nestjs/graphql';
import { IsJWT, IsNotEmpty } from 'class-validator';

@InputType()
export class GoogleAuthenticatedUserInput {
  @Field(() => String, { description: 'アクセストークン' })
  @IsNotEmpty()
  @IsJWT()
  accessToken!: string;
}
