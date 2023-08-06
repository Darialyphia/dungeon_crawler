import { isString } from '@dungeon-crawler/shared';
import {
  UnauthorizedError,
  UnexpectedError,
  errorFactory
} from '../../../utils/errorFactory';
import { UserRepository } from '../../user/user.repository';
import { UseCase } from '../../../utils/helpers';
import { isLeft, left, right } from 'fp-ts/Either';
import { AccessToken, RefreshToken, TokenService } from '../token.service';
import { RefreshTokenRepository } from '../refreshToken.repository';
import { Response, Request } from 'express';
import { Config, config } from '../../../config';
import { REFRESH_TOKEN_COOKIE } from '../../../utils/constants';

export type RefreshJwtUseCaseError = UnexpectedError | UnauthorizedError;

export type RefreshJwtUseCase = UseCase<
  void,
  { accessToken: AccessToken; refreshToken: RefreshToken },
  RefreshJwtUseCaseError
>;

type Dependencies = {
  userRepo: UserRepository;
  tokenService: TokenService;
  refreshTokenRepo: RefreshTokenRepository;
  req: Request;
  res: Response;
};

export const refreshJwtUsecase =
  ({
    userRepo,
    tokenService,
    refreshTokenRepo,
    req,
    res
  }: Dependencies): RefreshJwtUseCase =>
  async () => {
    const cookie = req.cookies?.[REFRESH_TOKEN_COOKIE];
    if (!isString(cookie)) {
      return left(errorFactory.unauthorized());
    }

    const user = await userRepo.findByRefreshToken(cookie);
    if (isLeft(user)) return left(errorFactory.unauthorized());

    const verified = tokenService.verifyRefreshToken(cookie);
    if (isLeft(verified)) return verified;

    const refreshToken = await refreshTokenRepo.upsertByUserId(user.right.id);
    if (isLeft(refreshToken)) return left(errorFactory.unexpected());

    res.cookie(REFRESH_TOKEN_COOKIE, refreshToken.right.value, {
      path: config.REFRESH_TOKEN.PATH,
      httpOnly: config.REFRESH_TOKEN.HTTPONLY,
      secure: config.REFRESH_TOKEN.SECURE,
      sameSite: config.REFRESH_TOKEN.SAMESITE,
      maxAge: Date.now() + config.REFRESH_TOKEN.EXPIRES_IN_SECONDS * 1000
    });

    return right({
      accessToken: tokenService.generateAccessToken(user.right.id),
      refreshToken: refreshToken.right.value
    });
  };
