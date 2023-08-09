import { asFunction } from 'awilix';
import { gameApi } from './game.api';

export const gameProviders = {
  gameApi: asFunction(gameApi)
};
