import { asFunction } from 'awilix';
import { userApi } from './api/user.api';

export const userProviders = {
  userApi: asFunction(userApi)
};
