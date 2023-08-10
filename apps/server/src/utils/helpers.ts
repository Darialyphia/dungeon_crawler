import * as E from 'fp-ts/Either';
import { AppError } from './errorFactory';
import crypto from 'crypto';
import { DomainEvents, Emitter } from '../features/core/providers/event-emitter';
import { pipe } from 'fp-ts/function';

export const execute = <T extends () => any>(fn: T): ReturnType<T> => fn();

export type UseCase<TInput, TResponse, TError extends AppError> = (
  input: TInput
) => Promise<E.Either<TError, TResponse>>;

export const randomHash = () => crypto.randomBytes(10).toString('hex');

export const makeSuccess = () => ({
  success: true
});
