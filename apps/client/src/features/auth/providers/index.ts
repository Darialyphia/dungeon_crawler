import { Lifetime, asFunction } from 'awilix';
import { authApi } from './auth.api';
import { passwordResetApi } from './passwordReset.api';

export const authProviders = {
  authApi: asFunction(authApi, { lifetime: Lifetime.SINGLETON }),
  passwordResetApi: asFunction(passwordResetApi)
};
