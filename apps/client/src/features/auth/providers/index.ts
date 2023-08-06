import { Lifetime, asFunction } from 'awilix';
import { authApi } from './auth.api';

export const authProviders = {
  authApi: asFunction(authApi, { lifetime: Lifetime.SINGLETON })
};
