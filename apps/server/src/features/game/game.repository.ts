import { PrismaClient } from '@prisma/client';
import * as E from 'fp-ts/Either';
import { handlePrismaError, prismaNotFoundMatchers } from '../../utils/prisma';
import { NotFoundError, UnexpectedError } from '../../utils/errorFactory';
import { UUID } from '@dungeon-crawler/contract';
import { Game } from './game.entity';

export type GameRepository = {
  findAll(): Promise<E.Either<UnexpectedError, Game[]>>;
  findById(id: UUID): Promise<E.Either<UnexpectedError | NotFoundError, Game>>;
};

export const gameRepository = ({ prisma }: { prisma: PrismaClient }): GameRepository => {
  return {
    async findAll() {
      try {
        const games = await prisma.game.findMany({
          include: { players: true, author: true }
        });

        return E.right(games);
      } catch (err) {
        return E.left(handlePrismaError()(err));
      }
    },

    async findById(id) {
      try {
        const game = await prisma.game.findUniqueOrThrow({
          where: { id },
          include: { players: true, author: true }
        });

        return E.right(game);
      } catch (err) {
        return E.left(handlePrismaError(prismaNotFoundMatchers)(err));
      }
    }
  };
};
