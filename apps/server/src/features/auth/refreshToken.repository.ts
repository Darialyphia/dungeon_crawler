import { PrismaClient } from '@prisma/client';
import * as E from 'fp-ts/Either';
import { handlePrismaError, prismaNotFoundMatchers } from '../../utils/prisma';
import { NotFoundError, UnexpectedError } from '../../utils/errorFactory';
import { UUID } from '@dungeon-crawler/contract';
import { RefreshToken } from './refreshToken.entity';
import { TokenService } from './token.service';

export type HashedRefreshToken = string;

export type RefreshTokenRepository = {
  upsertByUserId(
    id: UUID
  ): Promise<E.Either<UnexpectedError | NotFoundError, RefreshToken>>;
  deleteByValue(
    value: HashedRefreshToken
  ): Promise<E.Either<UnexpectedError | NotFoundError, RefreshToken>>;
};

type Dependencies = {
  prisma: PrismaClient;
  tokenService: TokenService;
};

export const refreshTokenRepository = ({
  prisma,
  tokenService
}: Dependencies): RefreshTokenRepository => {
  return {
    async upsertByUserId(id) {
      try {
        const value = tokenService.generateRefreshToken();

        const user = await prisma.user.update({
          where: { id },
          data: {
            refreshToken: {
              upsert: {
                create: {
                  value
                },
                update: {
                  value
                }
              }
            }
          },
          include: {
            refreshToken: true
          }
        });

        return E.right(user.refreshToken!);
      } catch (err) {
        return E.left(handlePrismaError(prismaNotFoundMatchers)(err));
      }
    },

    async deleteByValue(value) {
      try {
        const token = await prisma.refreshToken.delete({ where: { value } });

        return E.right(token);
      } catch (err) {
        return E.left(handlePrismaError(prismaNotFoundMatchers)(err));
      }
    }
  };
};
