import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class UpdateUserRoleInput {
  @Field(() => String, { description: '更新対象ユーザーのdisplayedId' })
  @IsNotEmpty()
  @IsUUID()
  updateTargetUserDisplayedId!: string;

  @Field(() => String, { description: '更新対象ユーザーの新しい権限のdisplaydId' })
  @IsNotEmpty()
  @IsUUID()
  newRoleDisplayedId!: string;
}
