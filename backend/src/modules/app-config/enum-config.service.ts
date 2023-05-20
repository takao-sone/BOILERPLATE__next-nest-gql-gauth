import { Injectable } from '@nestjs/common';
import { registerEnumType } from '@nestjs/graphql';
import { SortDirection } from 'src/common/pagination/order-direction.model';
import { RoleSortField } from 'src/common/pagination/role-order.model';
import { UserSortField } from 'src/common/pagination/user-order.model';

@Injectable()
export class EnumConfigService {
  constructor() {
    registerEnumType(UserSortField, {
      name: 'UserSortField',
      description: 'Properties by which user connections can be ordered.',
    });

    registerEnumType(RoleSortField, {
      name: 'RoleSortField',
      description: 'Properties by which role connections can be ordered.',
    });

    registerEnumType(SortDirection, {
      name: 'SortDirection',
      description:
        'Possible directions in which to order a list of items when provided an `orderBy` argument.',
    });
  }
}
