import { PrismaClient } from '@prisma/client';
import * as E from 'fp-ts/Either';
import { handlePrismaError, prismaNotFoundMatchers } from '../../../utils/prisma';
import {
  NotFoundError,
  UnexpectedError,
  errorFactory
} from '../../../utils/errorFactory';
import { PasswordResetToken } from '../entities/passwordResetToken.entity';

export type HashedPasswordResetToken = string;

export type PasswordResetTokenRepository = {
  getByUserEmail(
    email: string
  ): Promise<E.Either<UnexpectedError | NotFoundError, PasswordResetToken>>;
  upsertByUserEmail(
    email: string,
    token: string
  ): Promise<E.Either<UnexpectedError | NotFoundError, PasswordResetToken>>;
  deleteByValue(
    value: HashedPasswordResetToken
  ): Promise<E.Either<UnexpectedError | NotFoundError, PasswordResetToken>>;
};

type Dependencies = {
  prisma: PrismaClient;
};

export const passwordResetTokenRepository = ({
  prisma
}: Dependencies): PasswordResetTokenRepository => {
  return {
    async getByUserEmail(email) {
      try {
        const token = await prisma.user
          .findUnique({
            where: { email }
          })
          .passwordResetToken();

        return E.fromNullable(errorFactory.notFound())(token);
      } catch (err) {
        return E.left(handlePrismaError(prismaNotFoundMatchers)(err));
      }
    },

    async upsertByUserEmail(email, token: string) {
      try {
        const user = await prisma.user.update({
          where: { email },
          data: {
            passwordResetToken: {
              upsert: {
                create: {
                  value: token
                },
                update: {
                  value: token
                }
              }
            }
          },
          include: {
            passwordResetToken: true
          }
        });

        return E.right(user.passwordResetToken!);
      } catch (err) {
        return E.left(handlePrismaError(prismaNotFoundMatchers)(err));
      }
    },

    async deleteByValue(value) {
      try {
        const token = await prisma.passwordResetToken.delete({ where: { value } });

        return E.right(token);
      } catch (err) {
        return E.left(handlePrismaError(prismaNotFoundMatchers)(err));
      }
    }
  };
};
