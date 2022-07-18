import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsPositive, IsUUID, Max, Min, ValidateIf } from 'class-validator';

const MAX_TAKE = 100;
const MAX_SKIP = 100;
const DEFAULT_FIRST = 1;
const DEFAULT_SKIP = 1;

export const DEFAULT_PAGINATION_INPUT = {
  first: DEFAULT_FIRST,
  skip: DEFAULT_SKIP,
};

export type PaginationInputFirst = Required<Pick<PaginationInput, 'first'>> &
  Pick<PaginationInput, 'skip' | 'after'>;

export type PaginationInputLast = Required<Pick<PaginationInput, 'last'>> &
  Pick<PaginationInput, 'skip' | 'before'>;

@InputType()
export class PaginationInput {
  @Field(() => Int, {
    nullable: true,
    description: 'カーソルを含めた取得する値のスキップ数',
  })
  @ValidateIf((object, value) => value !== undefined)
  @IsNumber()
  @Min(0)
  @Max(MAX_SKIP)
  skip?: number;

  @Field(() => String, {
    nullable: true,
    description: '起点となるカーソル(カーソル以降の値取得時)',
  })
  @ValidateIf((object, value) => value !== undefined)
  @IsUUID()
  after?: string;

  @Field(() => String, {
    nullable: true,
    description: '起点となるカーソル(カーソル以前の値取得時)',
  })
  @ValidateIf((object, value) => value !== undefined)
  @IsUUID()
  before?: string;

  @Field(() => Int, {
    nullable: true,
    description: '値の取得数(カーソル以降の値取得時)',
  })
  @ValidateIf((object, value) => value !== undefined)
  @IsPositive()
  @Max(MAX_TAKE)
  first?: number;

  @Field(() => Int, {
    nullable: true,
    description: '値の取得数(カーソル以前の値取得時)',
  })
  @ValidateIf((object, value) => value !== undefined)
  @IsPositive()
  @Max(MAX_TAKE)
  last?: number;
}
