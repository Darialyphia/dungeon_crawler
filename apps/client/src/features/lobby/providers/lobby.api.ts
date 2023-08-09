import type { ApiClient } from '@/features/core/providers/apiClient';
import { apiHandler } from '@/utils/api-helpers';
import type { LobbyContract } from '@dungeon-crawler/contract';
import type { ClientInferResponses } from '@ts-rest/core';

export type GetAllLobbiesResponse = ClientInferResponses<LobbyContract['getAll'], 200>;

export type LobbyApi = {
  getAll(): Promise<GetAllLobbiesResponse['body']>;
};

export const lobbyApi = ({ apiClient }: { apiClient: ApiClient }): LobbyApi => {
  return {
    getAll() {
      return apiHandler(apiClient.lobby.getAll);
    }
  };
};
