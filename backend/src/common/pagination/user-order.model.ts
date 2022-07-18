import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { SortDirection } from './order-direction.model';
import { SortInput } from './order.model';

export enum UserSortField {
  ID = 'id',
  CREATED_AT = 'createdAt',
}

registerEnumType(UserSortField, {
  name: 'UserSortField',
  description: 'Properties by which user connections can be ordered.',
});

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
