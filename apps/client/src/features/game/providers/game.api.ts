import type { ApiClient } from '@/features/core/providers/apiClient';
import { apiHandler } from '@/utils/api-helpers';
import type { GameContract } from '@dungeon-crawler/contract';
import type { ClientInferRequest, ClientInferResponses } from '@ts-rest/core';

export type GetAllGamesResponse = ClientInferResponses<GameContract['getAll'], 200>;

export type CreateGameRequest = ClientInferRequest<GameContract['create']>;
export type CreateGameResponse = ClientInferResponses<GameContract['create'], 201>;

export type JoinGameRequest = ClientInferRequest<GameContract['join']>;
export type JoinGameResponse = ClientInferResponses<GameContract['join'], 200>;

export type LeaveGameRequest = ClientInferRequest<GameContract['leave']>;
export type LeaveGameResponse = ClientInferResponses<GameContract['leave'], 200>;

export type GameApi = {
  getAll(): Promise<GetAllGamesResponse['body']>;
  create(body: CreateGameRequest['body']): Promise<CreateGameResponse['body']>;
  join(gameId: JoinGameRequest['params']['gameId']): Promise<JoinGameResponse['body']>;
  leave(gameId: LeaveGameRequest['params']['gameId']): Promise<LeaveGameResponse['body']>;
};

export const gameApi = ({ apiClient }: { apiClient: ApiClient }): GameApi => {
  return {
    getAll() {
      return apiHandler(apiClient.game.getAll);
    },
    create(body) {
      return apiHandler(apiClient.game.create, { body });
    },
    join(gameId) {
      return apiHandler(apiClient.game.join, { params: { gameId } });
    },
    leave(gameId) {
      return apiHandler(apiClient.game.leave, { params: { gameId } });
    }
  };
};
