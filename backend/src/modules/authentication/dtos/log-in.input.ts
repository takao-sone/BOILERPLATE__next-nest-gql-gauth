import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

@InputType()
export class LogInInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(128)
  email!: string;

  @Field(() => String)
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(64)
  password!: string;
}
