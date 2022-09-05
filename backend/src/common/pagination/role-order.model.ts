import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { SortDirection } from './order-direction.model';
import { SortInput } from './order.model';

export enum RoleSortField {
  ID = 'id',
}

registerEnumType(RoleSortField, {
  name: 'RoleSortField',
  description: 'Properties by which role connections can be ordered.',
});

@InputType()
export class RoleSortInput extends SortInput {
  @Field(() => RoleSortField, {
    nullable: true,
    description: 'ロール取得する際にソート対象にしたいフィールド',
  })
  field: RoleSortField = RoleSortField.ID;
}

export const DEFAULT_ROLE_SORT_INPUT: RoleSortInput = {
  field: RoleSortField.ID,
  direction: SortDirection.ASC,
};
