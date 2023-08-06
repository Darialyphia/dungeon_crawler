import type {
  ApiQueryOptions,
  UseApiMutationOptions
} from '@/features/core/composables/useApiQuery';
import { type Nullable } from '@dungeon-crawler/shared';
import { contract, type Contract } from '@dungeon-crawler/contract';
import type { AuthApi, LoginResponse } from '../api/auth.api';
import { queryKeys, type QueryKeys } from '@/features/core/queryKeys';

export const useLogin = (
  options: UseApiMutationOptions<Contract['auth']['login'], AuthApi['login']> = {}
) => {
  const { authApi } = useContainer();

  return useApiMutation(contract.auth.login, authApi.login, options);
};

export const useLogout = (
  options: UseApiMutationOptions<Contract['auth']['logout'], AuthApi['logout']> = {}
) => {
  const { authApi } = useContainer();

  return useApiMutation(contract.auth.logout, authApi.logout, options);
};

export const useIsAuthenticated = () => {
  const qc = useQueryClient();

  const query = useQuery({
    ...queryKeys.auth.token,
    queryFn: () =>
      Promise.resolve(
        qc.getQueryData<Nullable<LoginResponse['body']>>(queryKeys.auth.token.queryKey) ??
          null
      )
  });

  return computed(() => !!query.data.value?.accessToken);
};

export const useSession = (
  options: ApiQueryOptions<
    Contract['auth']['session'],
    QueryKeys['auth']['session']['queryKey']
  > = {}
) => {
  const { authApi } = useContainer();
  const isAuthenticated = useIsAuthenticated();

  return useApiQuery({
    ...options,
    ...queryKeys.auth.session,
    queryFn: authApi.session,
    enabled: isAuthenticated,
    route: contract.auth.session
  });
};
