import { Prisma } from '@prisma/client';
import { PrismaError } from 'prisma-error-enum';
import { ErrorFactory, UnexpectedError, errorFactory } from './errorFactory';
import { Values } from '@dungeon-crawler/shared';
import { matchSwitch } from '@babakness/exhaustive-type-checking';

export const prismaNotFoundMatchers = {
  [PrismaError.RecordsNotFound]: errorFactory.notFound,
  [PrismaError.RelatedRecordNotFound]: errorFactory.notFound
};

export const prismaNotUniqueMatchers = {
  [PrismaError.UniqueConstraintViolation]: errorFactory.badRequest
};

type HandlePrismaError = {
  <TError extends Values<ErrorFactory>>(matchers: Record<string, TError>): (
    err: unknown
  ) => ReturnType<TError> | UnexpectedError;
  (matchers?: undefined): (err: unknown) => UnexpectedError;
};

export const handlePrismaError: HandlePrismaError = (matchers: any) => {
  return (err: any) => {
    if (!(err instanceof Prisma.PrismaClientKnownRequestError)) {
      return errorFactory.unexpected({ cause: new Error(String(err)) });
    }

    try {
      const factories = Object.fromEntries(
        Object.entries(matchers).map(([k, v]) => [k, () => v])
      );
      const match = matchSwitch(err.code, factories as any);

      return (match as any)({ cause: new Error(String(err)) });
    } catch {
      return errorFactory.unexpected({ cause: new Error(String(err)) });
    }
  };
};
