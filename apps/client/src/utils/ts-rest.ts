import {
  type UseInfiniteQueryOptions,
  type UseInfiniteQueryReturnType,
  type UseMutationOptions,
  type UseMutationReturnType,
  type UseQueryOptions,
  type UseQueryReturnType,
  type QueryFunctionContext,
  type QueryKey
} from '@tanstack/vue-query';
import {
  type AppRoute,
  type ClientArgs,
  type ClientInferResponses,
  type ErrorHttpStatusCode,
  type PartialClientInferRequest,
  type SuccessfulHttpStatusCode
} from '@ts-rest/core';

// Data response if it's a 2XX
export type DataResponse<TAppRoute extends AppRoute> = ClientInferResponses<
  TAppRoute,
  SuccessfulHttpStatusCode,
  'force'
>;

// Error response if it's not a 2XX
export type ErrorResponse<TAppRoute extends AppRoute> = ClientInferResponses<
  TAppRoute,
  ErrorHttpStatusCode,
  'force'
>;

export type DataReturnQuery<
  TAppRoute extends AppRoute,
  TClientArgs extends ClientArgs
> = (
  queryKey: () => QueryKey,
  args: PartialClientInferRequest<TAppRoute, TClientArgs>,
  options?: UseQueryOptions<DataResponse<TAppRoute>, ErrorResponse<TAppRoute>>
) => UseQueryReturnType<DataResponse<TAppRoute>, ErrorResponse<TAppRoute>>;

// Used on X.useInfiniteQuery
export type DataReturnInfiniteQuery<
  TAppRoute extends AppRoute,
  TClientArgs extends ClientArgs
> = (
  queryKey: () => QueryKey,
  args: (
    context: QueryFunctionContext<QueryKey>
  ) => PartialClientInferRequest<TAppRoute, TClientArgs>,
  options?: UseInfiniteQueryOptions<DataResponse<TAppRoute>, ErrorResponse<TAppRoute>>
) => UseInfiniteQueryReturnType<DataResponse<TAppRoute>, ErrorResponse<TAppRoute>>;

// Used pn X.createMutation
export type DataReturnMutation<
  TAppRoute extends AppRoute,
  TClientArgs extends ClientArgs
> = (
  options?: UseMutationOptions<
    DataResponse<TAppRoute>,
    ErrorResponse<TAppRoute>,
    PartialClientInferRequest<TAppRoute, TClientArgs>,
    unknown
  >
) => UseMutationReturnType<
  DataResponse<TAppRoute>,
  ErrorResponse<TAppRoute>,
  PartialClientInferRequest<TAppRoute, TClientArgs>,
  unknown
>;
