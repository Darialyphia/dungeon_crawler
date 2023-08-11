import { contract } from '@dungeon-crawler/contract';
import { initServer } from '@ts-rest/express';
import { HTTP_STATUS_CODES, errorFactory } from '../../utils/errorFactory';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';

const s = initServer();

export const gameRouter = s.router(contract.game, {
  async getAll({ req: { container } }) {
    const { errorMapper, gameMapper, getAllGamesUseCase } = container.cradle;

    return pipe(
      await getAllGamesUseCase(),

      E.matchW(
        err => {
          return {
            status: err.statusCode,
            body: errorMapper.toResponse(err)
          };
        },
        async result => ({
          status: HTTP_STATUS_CODES.OK,
          body: await gameMapper.toResponseArray(result)
        })
      )
    );
  },
  async create({ body, req: { container } }) {
    const { errorMapper, gameMapper, createGameUseCase } = container.cradle;

    return pipe(
      await createGameUseCase(body),

      E.matchW(
        err => {
          return {
            status: err.statusCode,
            body: errorMapper.toResponse(err)
          };
        },
        async result => ({
          status: HTTP_STATUS_CODES.CREATED,
          body: await gameMapper.toResponse(result)
        })
      )
    );
  },
  async join({ params, req: { container } }) {
    const { errorMapper, gameMapper, joinGameUseCase } = container.cradle;

    return pipe(
      await joinGameUseCase(params),

      E.matchW(
        err => {
          return {
            status: err.statusCode,
            body: errorMapper.toResponse(err)
          };
        },
        async result => ({
          status: HTTP_STATUS_CODES.OK,
          body: await gameMapper.toResponse(result)
        })
      )
    );
  },

  async leave({ params, req: { container } }) {
    const { errorMapper, gameMapper, leaveGameUseCase, session } = container.cradle;

    return pipe(
      await leaveGameUseCase({ gameId: params.gameId, userId: session!.id }),

      E.matchW(
        err => {
          return {
            status: err.statusCode,
            body: errorMapper.toResponse(err)
          };
        },
        async result => ({
          status: HTTP_STATUS_CODES.OK,
          body: await gameMapper.toResponse(result)
        })
      )
    );
  }
});
