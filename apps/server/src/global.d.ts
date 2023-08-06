declare namespace Express {
  export interface Request {}
}

declare namespace TSReset {
  type NonFalsy<T> = T extends false | 0 | '' | null | undefined | 0n
    ? never
    : T;

  type WidenLiteral<T> = T extends string
    ? string
    : T extends number
    ? number
    : T extends boolean
    ? boolean
    : T extends bigint
    ? bigint
    : T extends symbol
    ? symbol
    : T;
}

interface Array<T> {
  includes(
    // eslint-disable-next-line @typescript-eslint/ban-types
    searchElement: T | (TSReset.WidenLiteral<T> & {}),
    fromIndex?: number
  ): boolean;
}
