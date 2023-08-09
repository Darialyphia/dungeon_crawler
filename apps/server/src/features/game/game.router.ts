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
        result => ({
          status: HTTP_STATUS_CODES.OK,
          body: gameMapper.toResponseArray(result)
        })
      )
    );
  }
});
