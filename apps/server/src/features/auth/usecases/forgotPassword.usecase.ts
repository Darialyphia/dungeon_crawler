import { NotFoundError, UnexpectedError } from '../../../utils/errorFactory';
import { UseCase } from '../../../utils/helpers';
import * as E from 'fp-ts/Either';
import { RefreshTokenRepository } from '../repositories/refreshToken.repository';
import { Response, Request } from 'express';
import { REFRESH_TOKEN_COOKIE } from '../../../utils/constants';
import { handlePrismaError } from '../../../utils/prisma';
import { isString } from '@dungeon-crawler/shared';
import { PasswordResetTokenRepository } from '../repositories/passwordResetToken.repository';
import { EmailService } from '../../core/mail.service';
import { TokenService } from '../token.service';
import { hash } from 'bcryptjs';

export type ForgotPasswordUseCaseError = UnexpectedError | NotFoundError;

export type ForgotPasswordUseCase = UseCase<string, null, ForgotPasswordUseCaseError>;

type Dependencies = {
  passwordResetTokenRepo: PasswordResetTokenRepository;
  emailService: EmailService;
  tokenService: TokenService;
  req: Request;
};

export const forgotPasswordUsecase =
  ({
    passwordResetTokenRepo,
    tokenService,
    emailService,
    req
  }: Dependencies): ForgotPasswordUseCase =>
  async email => {
    try {
      const value = tokenService.generatePasswordResetToken();
      const token = await passwordResetTokenRepo.upsertByUserEmail(
        email,
        await hash(value, 10)
      );

      if (E.isLeft(token)) return token;

      const { origin } = req.headers;

      return emailService.send({
        template: 'askForPasswordReset',
        head: { to: email!, subject: 'Password reset' },
        variables: {
          link: `${origin}/reset-password?email=${email}&token=${value}`
        }
      });
    } catch (err) {
      return E.left(handlePrismaError()(err));
    }
  };
