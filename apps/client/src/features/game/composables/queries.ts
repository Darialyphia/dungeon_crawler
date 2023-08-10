import type {
  ApiQueryOptions,
  UseApiMutationOptions
} from '@/features/core/composables/useApiQuery';
import { queryKeys, type QueryKeys } from '@/features/core/queryKeys';
import { contract, type Contract } from '@dungeon-crawler/contract';
import type { GameApi } from '../providers/game.api';

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

export const useCreateGame = (
  options: UseApiMutationOptions<Contract['game']['create'], GameApi['create']> = {}
) => {
  const { gameApi } = useContainer();

  return useApiMutation(contract.game.create, gameApi.create, options);
};

export const useJoinGame = (
  options: UseApiMutationOptions<Contract['game']['join'], GameApi['join']> = {}
) => {
  const { gameApi } = useContainer();

  return useApiMutation(contract.game.join, gameApi.join, options);
};

export const useLeaveGame = (
  options: UseApiMutationOptions<Contract['game']['leave'], GameApi['leave']> = {}
) => {
  const { gameApi } = useContainer();

  return useApiMutation(contract.game.leave, gameApi.leave, options);
};
