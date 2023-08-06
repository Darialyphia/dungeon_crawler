import type { DataResponse, ErrorResponse } from '@/utils/ts-rest';
import type {
  QueryKey,
  UseInfiniteQueryOptions,
  UseInfiniteQueryReturnType,
  UseMutationOptions,
  UseMutationReturnType,
  UseQueryOptions,
  UseQueryReturnType
} from '@tanstack/vue-query';
import type { AppRoute } from '@ts-rest/core';

export type UseApiQueryOptions<
  TAppRoute extends AppRoute,
  TKey extends QueryKey
> = UseQueryOptions<
  DataResponse<TAppRoute>['body'],
  ErrorResponse<TAppRoute>['body'],
  DataResponse<TAppRoute>,
  TKey
> & { route: TAppRoute };

export type ApiQueryOptions<TAppRoute extends AppRoute, TKey extends QueryKey> = Omit<
  UseApiQueryOptions<TAppRoute, TKey>,
  'queryKey' | 'queryFn' | 'route'
>;

export const useApiQuery = <TAppRoute extends AppRoute, TKey extends QueryKey>(
  options: UseApiQueryOptions<TAppRoute, TKey>
): UseQueryReturnType<
  DataResponse<TAppRoute>['body'],
  ErrorResponse<TAppRoute>['body']
> => {
  return useQuery(options);
};

export type UseApiInfiniteQueryOptions<
  TAppRoute extends AppRoute,
  TKey extends QueryKey
> = UseInfiniteQueryOptions<
  DataResponse<TAppRoute>['body'],
  ErrorResponse<TAppRoute>['body'],
  DataResponse<TAppRoute>,
  TKey
>;

export const createUseApiInfiniteQuery =
  <TAppRoute extends AppRoute>() =>
  <TKey extends QueryKey>(
    options: UseApiInfiniteQueryOptions<TAppRoute, TKey>
  ): UseInfiniteQueryReturnType<
    DataResponse<TAppRoute>['body'],
    ErrorResponse<TAppRoute>['body']
  > => {
    return useInfiniteQuery(options);
  };

export type UseMutationFn<TAppRoute extends AppRoute> = (
  arg: any
) => Promise<DataResponse<TAppRoute>['body']>;

export type UseApiMutationOptions<
  TAppRoute extends AppRoute,
  TFunction extends UseMutationFn<AppRoute>
> = UseMutationOptions<
  DataResponse<TAppRoute>['body'],
  ErrorResponse<TAppRoute>['body'],
  Parameters<TFunction>[0],
  unknown
>;

export const useApiMutation = <
  TAppRoute extends AppRoute,
  TFunction extends (arg: any) => Promise<DataResponse<TAppRoute>['body']>
>(
  route: TAppRoute,
  fn: TFunction,
  options: Omit<UseApiMutationOptions<TAppRoute, TFunction>, 'mutationFn'> = {}
): UseMutationReturnType<
  DataResponse<TAppRoute>['body'],
  ErrorResponse<TAppRoute>['body'],
  Parameters<TFunction>[0],
  unknown
> => {
  return useMutation({ ...options, mutationFn: fn });
};
