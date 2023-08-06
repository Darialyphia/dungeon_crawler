import { asFunction } from 'awilix';
import { tokenService } from './token.service';
import { loginUsecase } from './usecases/login.usecase';
import { refreshTokenRepository } from './refreshToken.repository';
import { logoutUsecase } from './usecases/logout.usecase';
import { refreshJwtUsecase } from './usecases/refreshJwt.usecase';
import { authenticateUsecase } from './usecases/authenticate.usecase';

export const authProviders = {
  tokenService: asFunction(tokenService),
  refreshTokenRepo: asFunction(refreshTokenRepository),

  loginUseCase: asFunction(loginUsecase),
  logoutUseCase: asFunction(logoutUsecase),
  refreshJwtUseCase: asFunction(refreshJwtUsecase),
  authenticateUseCase: asFunction(authenticateUsecase)
};
