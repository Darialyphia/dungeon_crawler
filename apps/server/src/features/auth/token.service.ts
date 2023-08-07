import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { UUID } from '@dungeon-crawler/contract';
import { randomHash } from '../../utils/helpers';
import { UnauthorizedError, errorFactory } from '../../utils/errorFactory';
import { left, right, Either } from 'fp-ts/Either';

export type AccessToken = string;
export type RefreshToken = string;
export type PasswordResetToken = string;

export type TokenService = {
  generateAccessToken(userId: UUID): AccessToken;
  generateRefreshToken(): RefreshToken;
  generatePasswordResetToken(): PasswordResetToken;
  verifyAccessToken(token: AccessToken): Either<UnauthorizedError, jwt.JwtPayload>;
  verifyRefreshToken(token: RefreshToken): Either<UnauthorizedError, jwt.JwtPayload>;
  verifyPasswordResetToken(
    token: RefreshToken
  ): Either<UnauthorizedError, jwt.JwtPayload>;
};

export const tokenService = (): TokenService => {
  const verifyToken = (token: string, secret: string) => {
    try {
      return right(jwt.verify(token, secret) as jwt.JwtPayload);
    } catch (err) {
      return left(errorFactory.unauthorized());
    }
  };

  return {
    generateAccessToken(userId: UUID) {
      return jwt.sign({ sub: userId }, config.JWT.SECRET, {
        expiresIn: config.JWT.EXPIRES_IN_SECONDS
      });
    },
    generateRefreshToken() {
      return jwt.sign({ sub: randomHash() }, config.REFRESH_TOKEN.SECRET, {
        expiresIn: config.REFRESH_TOKEN.EXPIRES_IN_SECONDS
      });
    },
    generatePasswordResetToken() {
      return jwt.sign({ sub: randomHash() }, config.PASSWORD_RESET.SECRET, {
        expiresIn: config.PASSWORD_RESET.EXPIRES_IN_SECONDS
      });
    },
    verifyAccessToken(token) {
      return verifyToken(token, config.JWT.SECRET);
    },
    verifyRefreshToken(token) {
      return verifyToken(token, config.REFRESH_TOKEN.SECRET);
    },
    verifyPasswordResetToken(token) {
      return verifyToken(token, config.PASSWORD_RESET.SECRET);
    }
  };
};
