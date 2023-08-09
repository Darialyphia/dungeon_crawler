import { PrismaClient } from '@prisma/client';
import * as E from 'fp-ts/Either';
import { handlePrismaError, prismaNotFoundMatchers } from '../../utils/prisma';
import { NotFoundError, UnexpectedError } from '../../utils/errorFactory';
import { UUID } from '@dungeon-crawler/contract';
import { Lobby } from './lobby.entity';

export type LobbyRepository = {
  findAll(): Promise<E.Either<UnexpectedError, Lobby[]>>;
  findById(id: UUID): Promise<E.Either<UnexpectedError | NotFoundError, Lobby>>;
};

export const lobbyRepository = ({
  prisma
}: {
  prisma: PrismaClient;
}): LobbyRepository => {
  return {
    async findAll() {
      try {
        const lobbies = await prisma.lobby.findMany({
          include: { participants: true, author: true }
        });

        return E.right(lobbies);
      } catch (err) {
        return E.left(handlePrismaError()(err));
      }
    },

    async findById(id) {
      try {
        const lobby = await prisma.lobby.findUniqueOrThrow({
          where: { id },
          include: { participants: true, author: true }
        });

        return E.right(lobby);
      } catch (err) {
        return E.left(handlePrismaError(prismaNotFoundMatchers)(err));
      }
    }
  };
};
