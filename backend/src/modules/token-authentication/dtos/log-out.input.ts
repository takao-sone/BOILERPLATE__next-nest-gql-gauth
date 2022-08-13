import { Field, InputType } from '@nestjs/graphql';
import { IsJWT, IsNotEmpty } from 'class-validator';

@InputType()
export class TokenLogOutInput {
  @Field(() => String, { description: 'リフレッシュトークン' })
  @IsNotEmpty()
  @IsJWT()
  refreshToken!: string;
}
