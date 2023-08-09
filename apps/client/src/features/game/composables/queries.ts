import type { ApiQueryOptions } from '@/features/core/composables/useApiQuery';
import { queryKeys, type QueryKeys } from '@/features/core/queryKeys';
import { contract, type Contract } from '@dungeon-crawler/contract';

export const useGames = (
  options: ApiQueryOptions<
    Contract['game']['getAll'],
    QueryKeys['game']['getAll']['queryKey']
  > = {}
) => {
  const { gameApi } = useContainer();

  return useApiQuery({
    ...options,
    ...queryKeys.game.getAll,
    queryFn: gameApi.getAll,
    route: contract.game.getAll
  });
};
