import { asFunction } from 'awilix';
import { tokenService } from './token.service';
import { loginUsecase } from './usecases/login.usecase';
import { refreshTokenRepository } from './repositories/refreshToken.repository';
import { logoutUsecase } from './usecases/logout.usecase';
import { refreshJwtUsecase } from './usecases/refreshJwt.usecase';
import { authenticateUsecase } from './usecases/authenticate.usecase';
import { passwordResetTokenRepository } from './repositories/passwordResetToken.repository';
import { forgotPasswordUsecase } from './usecases/forgotPassword.usecase';
import { resetPasswordUsecase } from './usecases/resetPassword.usecase';

export const authProviders = {
  tokenService: asFunction(tokenService),
  refreshTokenRepo: asFunction(refreshTokenRepository),
  passwordResetTokenRepo: asFunction(passwordResetTokenRepository),

  loginUseCase: asFunction(loginUsecase),
  logoutUseCase: asFunction(logoutUsecase),
  refreshJwtUseCase: asFunction(refreshJwtUsecase),
  authenticateUseCase: asFunction(authenticateUsecase),
  forgotPasswordUseCase: asFunction(forgotPasswordUsecase),
  resetPasswordUseCase: asFunction(resetPasswordUsecase)
};
