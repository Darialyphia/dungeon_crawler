import { Contract } from '@dungeon-crawler/contract';
import { asValue } from 'awilix';
import { isRight } from 'fp-ts/lib/Either';
import { errorFactory } from '../../utils/errorFactory';
import { TsRestExpressOptions } from '@ts-rest/express/src/lib/types';

const parseAuthHeader = (header: string) => header.split(' ')[1];

export const authMiddleware: Exclude<
  TsRestExpressOptions<Contract>['globalMiddleware'],
  undefined
>[number] = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const session = await req.container.resolve('authenticateUseCase')(
      parseAuthHeader(authHeader)
    );

    if (isRight(session)) {
      req.container.register('session', asValue(session.right));
    }
  }

  if ('metadata' in req.tsRestRoute) {
    const { session, errorMapper } = req.container.cradle;
    const meta = req.tsRestRoute.metadata;
    if (!meta.public && !session) {
      return res.status(401).json(errorMapper.toResponse(errorFactory.unauthorized()));
    }
  }

  next();
};
