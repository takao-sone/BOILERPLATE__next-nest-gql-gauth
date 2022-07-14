import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PageInfo } from './page-info.model';

export type EdgeTypeInterface<T> = {
  cursor: string;
  node: T;
};

export type PaginatedTypeInterface<EdgeType> = {
  new (): PaginatedTypeInterface<EdgeType>;
  edges: Array<EdgeType>;
  pageInfo: PageInfo;
  totalCount: number;
};

export function Paginated<TItem>(
  TItemClass: Type<TItem>,
): PaginatedTypeInterface<EdgeTypeInterface<TItem>> {
  @ObjectType(`${TItemClass.name}Edge`)
  abstract class EdgeType {
    @Field(() => String)
    cursor!: string;

    @Field(() => TItemClass)
    node!: TItem;
  }

  // `isAbstract` decorator option is mandatory to prevent registering in schema
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field(() => [EdgeType], { nullable: true })
    edges!: Array<EdgeType>;

    // @Field((type) => [TItemClass], { nullable: true })
    // nodes: Array<TItem>;

    @Field(() => PageInfo)
    pageInfo!: PageInfo;

    @Field(() => Int)
    totalCount!: number;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return PaginatedType;
}
