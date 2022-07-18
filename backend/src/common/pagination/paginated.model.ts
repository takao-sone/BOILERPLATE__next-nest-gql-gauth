import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PageInfo } from './page-info.model';

interface IEdgeType<T> {
  cursor: string;
  node: T;
}

export interface IPaginatedType<T> {
  edges: IEdgeType<T>[];
  // If you need nodes, comment the codes in.
  // nodes: T[];
  pageInfo: PageInfo;
  totalCount: number;
}

export function Paginated<T>(classRef: Type<T>): Type<IPaginatedType<T>> {
  @ObjectType(`${classRef.name}Edge`)
  abstract class EdgeType {
    @Field(() => String, { description: '現在のnodeのカーソル' })
    cursor!: string;

    @Field(() => classRef, { description: 'nodeオブジェクト' })
    node!: T;
  }

  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements IPaginatedType<T> {
    @Field(() => [EdgeType], { nullable: true, description: 'edgeオブジェクト配列' })
    edges!: EdgeType[];

    // If you need nodes, comment the codes in.
    // @Field(() => [classRef], { nullable: true })
    // nodes: T[];

    @Field(() => PageInfo, { description: 'ページネーションに関する情報' })
    pageInfo!: PageInfo;

    @Field(() => Int, { description: '指定した条件で取得できる最大データ数' })
    totalCount!: number;
  }

  return PaginatedType as Type<IPaginatedType<T>>;
}
