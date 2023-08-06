import { asValue } from 'awilix';
import { Request, Response, NextFunction } from 'express';
import { RequestScopedContainer, container } from '../../../container';

declare global {
  namespace Express {
    interface Request {
      container: RequestScopedContainer;
    }
  }
}

export const requestScopeMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const scope = container.createScope();
  scope.register('req', asValue(req));
  scope.register('res', asValue(res));

  req.container = scope;

  next();
};
