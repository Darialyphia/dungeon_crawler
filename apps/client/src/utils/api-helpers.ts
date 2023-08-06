import type { ErrorResponse } from '@dungeon-crawler/contract';
import { type AnyObject, isObject, isString } from '@dungeon-crawler/shared';
import type { HTTPStatusCode, ErrorHttpStatusCode } from '@ts-rest/core';

export const isApiError = <T extends { status: HTTPStatusCode }>(
  response: T
): response is T & { status: ErrorHttpStatusCode } => {
  return response.status < 200 || response.status > 207;
};

type GenericApiFunction = (
  ...args: any[]
) => Promise<{ status: HTTPStatusCode; body: AnyObject }>;

export const apiHandler = <TFn extends GenericApiFunction>(
  fn: TFn,
  ...args: Parameters<TFn>
): Promise<
  Exclude<Awaited<ReturnType<TFn>>, { status: ErrorHttpStatusCode }>['body']
> => {
  return fn(...args).then(response => {
    if (isApiError(response)) throw response.body;

    return response.body;
  });
};

export const isErrorResponse = <TKind extends string>(
  x: unknown,
  kind?: TKind
): x is TKind extends undefined
  ? ErrorResponse
  : ErrorResponse extends TKind
  ? never
  : ErrorResponse & { kind: TKind } => {
  const isError =
    isObject(x) &&
    'kind' in x &&
    'message' in x &&
    isString(x.kind) &&
    isString(x.message);
  if (!isError) return false;
  if (!isDefined(kind)) return true;
  return kind === x.kind;
};
