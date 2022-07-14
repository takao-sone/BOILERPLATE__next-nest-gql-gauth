import { ArgsType } from '@nestjs/graphql';

// export abstract class PaginationArgs {
//   @Field(() => Int, {
//     nullable: true,
//     defaultValue: DEFAULT_PAGE_VALUE,
//     description: `ページ番号`,
//   })
//   @IsPositive()
//   page = DEFAULT_PAGE_VALUE;

//   @Field(() => Int, {
//     nullable: true,
//     defaultValue: DEFAULT_TAKE_VALUE,
//     description: `取得するデータ数`,
//   })
//   @IsPositive()
//   @Max(MAX_TAKE_VALUE)
//   take = DEFAULT_TAKE_VALUE;
// }

// TODO: class-validator
@ArgsType()
export class PaginationArgs {
  skip?: number;

  after?: string;

  before?: string;

  first?: number;

  last?: number;
}
