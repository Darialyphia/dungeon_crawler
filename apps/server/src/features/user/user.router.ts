import { contract } from '@dungeon-crawler/contract';
import { initServer } from '@ts-rest/express';
import { HTTP_STATUS_CODES } from '../../utils/errorFactory';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';

const s = initServer();

export const userRouter = s.router(contract.user, {
  async signup({ body, req: { container } }) {
    const { signupUseCase, errorMapper, userMapper } = container.cradle;

    return pipe(
      await signupUseCase(body),

      E.matchW(
        err => {
          return {
            status: err.statusCode,
            body: errorMapper.toResponse(err)
          };
        },
        result => ({
          status: HTTP_STATUS_CODES.CREATED,
          body: userMapper.toResponse(result)
        })
      )
    );
  },

  async updateProfile({ body, params, req: { container } }) {
    const { updateProfileUseCase, errorMapper, userMapper } = container.cradle;

    return pipe(
      await updateProfileUseCase({ userId: params.userId, profile: body }),
      E.matchW(
        err => {
          return {
            status: err.statusCode,
            body: errorMapper.toResponse(err)
          };
        },
        result => ({
          status: HTTP_STATUS_CODES.OK,
          body: userMapper.toResponse(result)
        })
      )
    );
  }
});
