import { asFunction } from 'awilix';
import { lobbyApi } from './lobby.api';

export const lobbyProviders = {
  lobbyApi: asFunction(lobbyApi)
};
