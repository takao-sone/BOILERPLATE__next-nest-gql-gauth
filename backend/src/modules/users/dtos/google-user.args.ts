import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@ArgsType()
export class UserArgs {
  @Field(() => String, { description: 'ユーザーのdisplayedId' })
  @IsNotEmpty()
  @IsUUID()
  displayedId!: string;
}
