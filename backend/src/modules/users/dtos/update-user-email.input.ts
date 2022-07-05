import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

@InputType()
export class UpdateUserEmailInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(128)
  newEmail!: string;
}
