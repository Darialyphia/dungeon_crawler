import { asFunction } from 'awilix';
import { userApi } from './user.api';

export const userProviders = {
  userApi: asFunction(userApi)
};
