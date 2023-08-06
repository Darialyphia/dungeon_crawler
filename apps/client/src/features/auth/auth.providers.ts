import { Lifetime, asFunction } from 'awilix';
import { authApi } from './api/auth.api';

export const authProviders = {
  authApi: asFunction(authApi, { lifetime: Lifetime.SINGLETON })
};
