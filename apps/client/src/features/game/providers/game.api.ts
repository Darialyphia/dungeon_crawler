import type { ApiClient } from '@/features/core/providers/apiClient';
import { apiHandler } from '@/utils/api-helpers';
import type { GameContract } from '@dungeon-crawler/contract';
import type { ClientInferResponses } from '@ts-rest/core';

export type GetAllGamesResponse = ClientInferResponses<GameContract['getAll'], 200>;

export type GameApi = {
  getAll(): Promise<GetAllGamesResponse['body']>;
};

export const gameApi = ({ apiClient }: { apiClient: ApiClient }): GameApi => {
  return {
    getAll() {
      return apiHandler(apiClient.game.getAll);
    }
  };
};
