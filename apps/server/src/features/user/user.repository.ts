import { PrismaClient } from '@prisma/client';
import * as E from 'fp-ts/Either';
import {
  handlePrismaError,
  prismaNotFoundMatchers,
  prismaNotUniqueMatchers
} from '../../utils/prisma';
import {
  BadRequestError,
  NotFoundError,
  UnexpectedError,
  errorFactory
} from '../../utils/errorFactory';
import { User } from './user.entity';
import { UUID } from '@dungeon-crawler/contract';
import { RefreshToken } from '../auth/token.service';

export type UpdateProfileInput = {
  name: string;
};

export type UserRepository = {
  create(user: {
    email: string;
    passwordHash: string;
  }): Promise<E.Either<UnexpectedError | BadRequestError, User>>;
  findById(id: UUID): Promise<E.Either<UnexpectedError | NotFoundError, User>>;
  findByEmail(email: string): Promise<E.Either<UnexpectedError | NotFoundError, User>>;
  findByRefreshToken(
    token: RefreshToken
  ): Promise<E.Either<UnexpectedError | NotFoundError, User>>;
  updateProfileById(
    id: UUID,
    profile: UpdateProfileInput
  ): Promise<E.Either<UnexpectedError | NotFoundError, User>>;
  resetPasswordByEmail(
    email: string,
    password: string
  ): Promise<E.Either<UnexpectedError | NotFoundError, User>>;
};

export const userRepository = ({ prisma }: { prisma: PrismaClient }): UserRepository => {
  return {
    async create(userData) {
      try {
        const user = await prisma.user.create({
          data: {
            ...userData
          }
        });

        return E.right(user);
      } catch (err) {
        return E.left(handlePrismaError(prismaNotUniqueMatchers)(err));
      }
    },

    async findById(id) {
      try {
        const user = await prisma.user.findUniqueOrThrow({ where: { id } });

        return E.right(user);
      } catch (err) {
        return E.left(handlePrismaError(prismaNotFoundMatchers)(err));
      }
    },

    async findByEmail(email) {
      try {
        const user = await prisma.user.findUniqueOrThrow({ where: { email } });

        return E.right(user);
      } catch (err) {
        return E.left(handlePrismaError()(err));
      }
    },

    async findByRefreshToken(value) {
      try {
        const user = await prisma.refreshToken.findUnique({ where: { value } }).user();

        return E.fromNullable(errorFactory.notFound())(user);
      } catch (err) {
        return E.left(handlePrismaError()(err));
      }
    },

    async updateProfileById(id, profile) {
      try {
        const user = await prisma.user.update({
          where: { id },
          data: profile
        });

        return E.right(user);
      } catch (err) {
        return E.left(handlePrismaError(prismaNotFoundMatchers)(err));
      }
    },

    async resetPasswordByEmail(email, passwordHash) {
      try {
        const user = await prisma.user.update({
          where: { email },
          data: {
            passwordHash,
            passwordResetToken: {
              delete: true
            }
          }
        });

        return E.right(user);
      } catch (err) {
        return E.left(handlePrismaError(prismaNotFoundMatchers)(err));
      }
    }
  };
};
