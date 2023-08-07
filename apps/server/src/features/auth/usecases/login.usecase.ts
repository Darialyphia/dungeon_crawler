import { authContract } from '@dungeon-crawler/contract';
import { ServerInferRequest } from '@ts-rest/core';
import {
  UnauthorizedError,
  UnexpectedError,
  errorFactory
} from '../../../utils/errorFactory';
import { UserRepository } from '../../user/user.repository';
import { UseCase } from '../../../utils/helpers';
import { isLeft, left, right } from 'fp-ts/Either';
import { compare } from 'bcryptjs';
import { AccessToken, RefreshToken, TokenService } from '../token.service';
import { RefreshTokenRepository } from '../repositories/refreshToken.repository';
import { Response } from 'express';
import { config } from '../../../config';
import { REFRESH_TOKEN_COOKIE } from '../../../utils/constants';

export type LoginInput = ServerInferRequest<typeof authContract.login>['body'];
export type LoginUseCaseError = UnexpectedError | UnauthorizedError;

export type LoginUseCase = UseCase<
  LoginInput,
  { accessToken: AccessToken; refreshToken: RefreshToken },
  LoginUseCaseError
>;

type Dependencies = {
  userRepo: UserRepository;
  tokenService: TokenService;
  refreshTokenRepo: RefreshTokenRepository;
  res: Response;
};

export const loginUsecase =
  ({ userRepo, tokenService, refreshTokenRepo, res }: Dependencies): LoginUseCase =>
  async input => {
    const user = await userRepo.findByEmail(input.email);

    if (isLeft(user)) return left(errorFactory.unauthorized());

    const isPasswordValid = await compare(input.password, user.right.passwordHash);
    if (!isPasswordValid) return left(errorFactory.unauthorized());

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
