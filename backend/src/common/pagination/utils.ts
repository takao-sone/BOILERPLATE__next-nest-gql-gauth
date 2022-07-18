import { Edge, Options, PrismaFindManyArguments } from '@devoxa/prisma-relay-cursor-connection';
import { PaginationInput, PaginationInputFirst, PaginationInputLast } from './pagination.input';

type AppRecord = { displayedId: string };

export type AppCursor = { displayedId: string };

export type AppFindManyCursorConnectionOptions = Options<
  AppRecord,
  AppCursor,
  AppRecord,
  Edge<AppRecord>
>;

export const getAppCursor: NonNullable<AppFindManyCursorConnectionOptions['getCursor']> = (
  record,
) => ({
  displayedId: record.displayedId,
});

export const encodeAppCursor: NonNullable<AppFindManyCursorConnectionOptions['encodeCursor']> = (
  cursor,
) => cursor.displayedId;

export const decodeAppCursor: NonNullable<AppFindManyCursorConnectionOptions['decodeCursor']> = (
  cursorString,
) => ({
  displayedId: cursorString,
});

export const appFindManyCursorConnectionOptions = {
  getCursor: getAppCursor,
  encodeCursor: encodeAppCursor,
  decodeCursor: decodeAppCursor,
};

export const isForwardPagination = (
  paginationInput: PaginationInput,
): paginationInput is PaginationInputFirst => {
  return 'first' in paginationInput && !!paginationInput.first;
};

export const isBackwardPagination = (
  paginationInput: PaginationInput,
): paginationInput is PaginationInputLast => {
  return 'last' in paginationInput && !!paginationInput.last;
};

/**
 * フロントから受け取ったページネーションオブジェクトを元にprismaのfindManyの引数として展開できるオブジェクトを生成
 * @param paginationInput ページネーションオブジェクト
 * @returns prismaのfindManyメソッドに展開できるカーソル・取得数・スキップ数が含まれたオブジェクト
 */
export const createFindManyArgs = (
  paginationInput: PaginationInput,
): PrismaFindManyArguments<AppCursor> => {
  if (isForwardPagination(paginationInput)) {
    const { skip, after, first } = paginationInput;
    const prismaFindManyArguments: PrismaFindManyArguments<AppCursor> = {
      take: first,
      skip: skip ?? 1,
    };

    return after
      ? {
          ...prismaFindManyArguments,
          cursor: { displayedId: after },
        }
      : prismaFindManyArguments;
  }

  if (isBackwardPagination(paginationInput)) {
    const { skip, before, last } = paginationInput;
    const prismaFindManyArguments: PrismaFindManyArguments<AppCursor> = {
      take: -1 * last,
      skip: skip ?? 1,
    };

    return before
      ? {
          ...prismaFindManyArguments,
          cursor: { displayedId: before },
        }
      : prismaFindManyArguments;
  }

  return {
    take: 1,
  };
};
