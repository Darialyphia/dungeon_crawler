import { AnyFunction, Nullable } from '@dungeon-crawler/shared';
import { config } from '../../../config';
import cors from 'cors';

export const corsMiddleware = cors({
  credentials: true,
  origin: (origin: Nullable<string>, callback: AnyFunction) => {
    if (!origin || config.CORS.ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS'));
    }
  }
});
