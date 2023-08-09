import { contract } from '@dungeon-crawler/contract';
import { initServer } from '@ts-rest/express';
import { HTTP_STATUS_CODES, errorFactory } from '../../utils/errorFactory';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { makeSuccess } from '../../utils/helpers';
import { errorMapper } from '../core/mappers/error.mapper';

const s = initServer();

export const authRouter = s.router(contract.auth, {
  async login({ body, req: { container } }) {
    const { loginUseCase, errorMapper } = container.cradle;

    return pipe(
      await loginUseCase(body),
      E.matchW(
        err => {
          return {
            status: err.statusCode,
            body: errorMapper.toResponse(err)
          };
        },
        result => ({
          status: HTTP_STATUS_CODES.OK,
          body: { accessToken: result.accessToken }
        })
      )
    );
  },

  async logout({ req: { container } }) {
    const { logoutUseCase, errorMapper } = container.cradle;

    return pipe(
      await logoutUseCase(),
      E.matchW(
        err => {
          return {
            status: err.statusCode,
            body: errorMapper.toResponse(err)
          };
        },
        () => ({
          status: HTTP_STATUS_CODES.OK,
          body: makeSuccess()
        })
      )
    );
  },

  async refresh({ req: { container } }) {
    const { refreshJwtUseCase, errorMapper } = container.cradle;

    return pipe(
      await refreshJwtUseCase(),
      E.matchW(
        err => {
          return {
            status: err.statusCode,
            body: errorMapper.toResponse(err)
          };
        },
        result => ({
          status: HTTP_STATUS_CODES.OK,
          body: { accessToken: result.accessToken }
        })
      )
    );
  },

  async session({ req: { container } }) {
    const { session, userMapper, errorMapper } = container.cradle;

    return pipe(
      E.fromNullable(errorFactory.unauthorized())(session),
      E.matchW(
        err => {
          return {
            status: err.statusCode,
            body: errorMapper.toResponse(err)
          };
        },
        async result => ({
          status: HTTP_STATUS_CODES.OK,
          body: await userMapper.toResponse(result)
        })
      )
    );
  },

  async forgotPassword({ body, req: { container } }) {
    const { errorMapper, forgotPasswordUseCase } = container.cradle;

    return pipe(
      await forgotPasswordUseCase(body.email),
      E.matchW(
        err => {
          return {
            status: err.statusCode,
            body: errorMapper.toResponse(err)
          };
        },
        () => ({
          status: HTTP_STATUS_CODES.OK,
          body: makeSuccess()
        })
      )
    );
  },

  async resetPassword({ body, req: { container } }) {
    const { errorMapper, resetPasswordUseCase } = container.cradle;

    return pipe(
      await resetPasswordUseCase(body),
      E.matchW(
        err => {
          return {
            status: err.statusCode,
            body: errorMapper.toResponse(err)
          };
        },
        () => ({
          status: HTTP_STATUS_CODES.OK,
          body: makeSuccess()
        })
      )
    );
  }
});
