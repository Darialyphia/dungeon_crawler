import { AnyZodObject } from 'zod';
import { GameEventHandler } from './emitter';

export const defineEventHandler = <T extends AnyZodObject>(
  handler: GameEventHandler<T>
) => handler;
