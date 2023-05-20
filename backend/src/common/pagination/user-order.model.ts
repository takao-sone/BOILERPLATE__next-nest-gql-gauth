import { Field, InputType } from '@nestjs/graphql';
import { SortDirection } from './order-direction.model';
import { SortInput } from './order.model';

export enum UserSortField {
  ID = 'id',
  CREATED_AT = 'createdAt',
}

@InputType()
export class UserSortInput extends SortInput {
  @Field(() => UserSortField, {
    nullable: true,
    description: 'ユーザー取得する際にソート対象にしたいフィールド',
  })
  field: UserSortField = UserSortField.ID;
}

export const DEFAULT_USER_SORT_INPUT: UserSortInput = {
  field: UserSortField.ID,
  direction: SortDirection.ASC,
};
