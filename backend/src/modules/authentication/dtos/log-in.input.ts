import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

@InputType()
export class LogInInput {
  @Field(() => String, { description: '登録したメールアドレス' })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(128)
  email!: string;

  @Field(() => String, { description: '登録したパスワード' })
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(64)
  password!: string;
}
