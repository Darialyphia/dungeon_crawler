import type { ApiQueryOptions } from '@/features/core/composables/useApiQuery';
import { queryKeys, type QueryKeys } from '@/features/core/queryKeys';
import { contract, type Contract } from '@dungeon-crawler/contract';

export const useLobbies = (
  options: ApiQueryOptions<
    Contract['lobby']['getAll'],
    QueryKeys['lobby']['getAll']['queryKey']
  > = {}
) => {
  const { lobbyApi } = useContainer();

  return useApiQuery({
    ...options,
    ...queryKeys.lobby.getAll,
    queryFn: lobbyApi.getAll,
    route: contract.lobby.getAll
  });
};
