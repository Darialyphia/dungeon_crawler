import { contract } from '@dungeon-crawler/contract';
import { initServer } from '@ts-rest/express';
import { HTTP_STATUS_CODES, errorFactory } from '../../utils/errorFactory';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';

const s = initServer();

export const lobbyRouter = s.router(contract.lobby, {
  async getAll({ req: { container } }) {
    const { errorMapper, lobbyMapper, getAllLobbiesUseCase } = container.cradle;

    return pipe(
      await getAllLobbiesUseCase(),

      E.matchW(
        err => {
          return {
            status: err.statusCode,
            body: errorMapper.toResponse(err)
          };
        },
        result => ({
          status: HTTP_STATUS_CODES.OK,
          body: lobbyMapper.toResponseArray(result)
        })
      )
    );
  }
});
