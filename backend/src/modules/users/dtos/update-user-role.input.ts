import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class UpdateUserRoleInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsUUID()
  updateTargetUserDisplayedId!: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsUUID()
  newRoleDisplayedId!: string;
}
