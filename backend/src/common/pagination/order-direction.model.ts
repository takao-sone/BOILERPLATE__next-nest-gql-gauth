import { registerEnumType } from '@nestjs/graphql';

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

registerEnumType(SortDirection, {
  name: 'SortDirection',
  description:
    'Possible directions in which to order a list of items when provided an `orderBy` argument.',
});
