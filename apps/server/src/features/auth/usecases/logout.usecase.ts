import { UnexpectedError } from '../../../utils/errorFactory';
import { UseCase } from '../../../utils/helpers';
import { left, right } from 'fp-ts/Either';
import { RefreshTokenRepository } from '../refreshToken.repository';
import { Response, Request } from 'express';
import { REFRESH_TOKEN_COOKIE } from '../../../utils/constants';
import { handlePrismaError } from '../../../utils/prisma';
import { isString } from '@dungeon-crawler/shared';

export type LogoutUseCaseError = UnexpectedError;

export type LogoutUseCase = UseCase<void, null, LogoutUseCaseError>;

type Dependencies = {
  refreshTokenRepo: RefreshTokenRepository;
  res: Response;
  req: Request;
};

export const logoutUsecase =
  ({ refreshTokenRepo, req, res }: Dependencies): LogoutUseCase =>
  async () => {
    try {
      const cookie = req.cookies?.[REFRESH_TOKEN_COOKIE];
      if (!isString(cookie)) return right(null);

      await refreshTokenRepo.deleteByValue(cookie);
      res.clearCookie(REFRESH_TOKEN_COOKIE);

      return right(null);
    } catch (err) {
      return left(handlePrismaError()(err));
    }
  };
