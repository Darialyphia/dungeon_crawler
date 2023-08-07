import {
  NotFoundError,
  UnauthorizedError,
  UnexpectedError,
  errorFactory
} from '../../../utils/errorFactory';
import { UseCase } from '../../../utils/helpers';
import * as E from 'fp-ts/Either';
import { handlePrismaError } from '../../../utils/prisma';
import { PasswordResetTokenRepository } from '../repositories/passwordResetToken.repository';
import { ServerInferRequest } from '@ts-rest/core';
import { AuthContract } from '@dungeon-crawler/contract';
import { compare, hash } from 'bcryptjs';
import { TokenService } from '../token.service';
import { UserRepository } from '../../user/user.repository';
import { User } from '../../user/user.entity';

export type ResetPasswordUseCaseError =
  | UnexpectedError
  | NotFoundError
  | UnauthorizedError;
export type ResetPasswordUseCaseInput = ServerInferRequest<
  AuthContract['resetPassword']
>['body'];

export type ResetPasswordUseCase = UseCase<
  ResetPasswordUseCaseInput,
  User,
  ResetPasswordUseCaseError
>;

type Dependencies = {
  passwordResetTokenRepo: PasswordResetTokenRepository;
  userRepo: UserRepository;
  tokenService: TokenService;
};

export const resetPasswordUsecase =
  ({
    passwordResetTokenRepo,
    userRepo,
    tokenService
  }: Dependencies): ResetPasswordUseCase =>
  async input => {
    try {
      const token = await passwordResetTokenRepo.getByUserEmail(input.email);

      if (E.isLeft(token)) return token;

      const isTokenValid = await compare(input.token, token.right.value);
      if (!isTokenValid) {
        return E.left(errorFactory.unauthorized());
      }

      const decoded = await tokenService.verifyPasswordResetToken(input.token);
      if (E.isLeft(decoded)) return decoded;

      return userRepo.resetPasswordByEmail(input.email, await hash(input.password, 10));
    } catch (err) {
      return E.left(handlePrismaError()(err));
    }
  };
