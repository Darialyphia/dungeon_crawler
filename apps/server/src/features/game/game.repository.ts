import { PrismaClient } from '@prisma/client';
import * as E from 'fp-ts/Either';
import { handlePrismaError, prismaNotFoundMatchers } from '../../utils/prisma';
import { NotFoundError, UnexpectedError, errorFactory } from '../../utils/errorFactory';
import { Game, GameId } from './game.entity';
import { UserId } from '../user/user.entity';

export type GameRepository = {
  findAll(): Promise<E.Either<UnexpectedError, Game[]>>;
  findById(id: GameId): Promise<E.Either<UnexpectedError | NotFoundError, Game>>;
  findByAuthorId(id: UserId): Promise<E.Either<UnexpectedError | NotFoundError, Game>>;
  findByPlayerId(id: UserId): Promise<E.Either<UnexpectedError | NotFoundError, Game>>;
  create(data: {
    name: string;
    capacity: number;
    authorId: UserId;
  }): Promise<E.Either<UnexpectedError, Game>>;
  join(data: {
    gameId: GameId;
    playerId: UserId;
  }): Promise<E.Either<UnexpectedError | NotFoundError, Game>>;
  leave(data: {
    gameId: GameId;
    playerId: UserId;
  }): Promise<E.Either<UnexpectedError | NotFoundError, Game>>;
  delete(id: GameId): Promise<E.Either<UnexpectedError, null>>;
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
    },

    async findByAuthorId(authorId) {
      try {
        const game = await prisma.game.findUniqueOrThrow({
          where: { authorId },
          include: { players: true, author: true }
        });

        return E.right(game);
      } catch (err) {
        return E.left(handlePrismaError(prismaNotFoundMatchers)(err));
      }
    },

    async findByPlayerId(id) {
      try {
        const game = await prisma.user
          .findUniqueOrThrow({
            where: { id }
          })
          .JoinedGame({
            include: { players: true, author: true }
          });

        return E.fromNullable(errorFactory.notFound())(game);
      } catch (err) {
        return E.left(handlePrismaError(prismaNotFoundMatchers)(err));
      }
    },

    async create({ name, capacity, authorId }) {
      try {
        const game = await prisma.game.create({
          data: {
            name,
            capacity,
            authorId
          },
          include: { players: true, author: true }
        });

        return E.right(game);
      } catch (err) {
        return E.left(handlePrismaError()(err));
      }
    },

    async join({ gameId, playerId }) {
      try {
        const game = await prisma.game.update({
          where: { id: gameId },
          data: {
            players: {
              connect: { id: playerId }
            }
          },
          include: { players: true, author: true }
        });

        return E.right(game);
      } catch (err) {
        return E.left(handlePrismaError(prismaNotFoundMatchers)(err));
      }
    },

    async leave({ gameId, playerId }) {
      try {
        const game = await prisma.game.update({
          where: { id: gameId },
          data: {
            players: {
              disconnect: { id: playerId }
            }
          },
          include: { players: true, author: true }
        });

        return E.right(game);
      } catch (err) {
        return E.left(handlePrismaError(prismaNotFoundMatchers)(err));
      }
    },

    async delete(id) {
      try {
        await prisma.game.delete({ where: { id } });

        return E.right(null);
      } catch (err) {
        return E.left(handlePrismaError()(err));
      }
    }
  };
};
