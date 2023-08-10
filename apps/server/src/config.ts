import {
  ONE_MINUTE_IN_MS,
  ONE_MINUTE_IN_SECONDS,
  ONE_WEEK_IN_SECONDS
} from '@dungeon-crawler/shared';
import z from 'zod';

const configSchema = z.object({
  PORT: z.coerce.number(),
  NODE_ENV: z.enum(['development', 'test', 'production']),
  IS_DEV: z.boolean(),
  IS_PROD: z.boolean(),

  COOKIE: z.object({
    SECRET: z.string()
  }),

  CORS: z.object({
    ALLOWED_ORIGINS: z.array(z.string())
  }),

  JWT: z.object({
    SECRET: z.string(),
    EXPIRES_IN_SECONDS: z.number()
  }),

  REFRESH_TOKEN: z.object({
    SECRET: z.string(),
    EXPIRES_IN_SECONDS: z.number(),
    PATH: z.string(),
    HTTPONLY: z.boolean(),
    SAMESITE: z.enum(['none', 'lax', 'strict']),
    SECURE: z.boolean()
  }),

  PASSWORD_RESET: z.object({
    SECRET: z.string(),
    EXPIRES_IN_SECONDS: z.number()
  }),

  MAILING: z.union([
    z.object({
      MAILDEV: z.object({
        HOST: z.undefined(),
        PORT: z.undefined()
      }),
      SENDGRID_API_KEY: z.string()
    }),
    z.object({
      MAILDEV: z.object({
        HOST: z.string(),
        PORT: z.string()
      }),
      SENDGRID_API_KEY: z.undefined()
    })
  ]),

  ENGINE_WORKERS: z.object({
    MAX_INSTANCES: z.number(),
    SHUTDOWN_TIMEOUT: z.number()
  })
});

export const config = configSchema.parse({
  PORT: process.env.PORT ?? 5000,
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  IS_DEV: process.env.NODE_ENV === 'development',
  IS_PROD: process.env.NODE_ENV === 'production',

  COOKIE: {
    SECRET: process.env.COOKIE_SECRET
  },

  CORS: {
    ALLOWED_ORIGINS: [
      'http://localhost:3000', // dev front end
      'http://localhost:5000', // local prod front end
      'http://localhost:3333' // vite preview
    ]
  },

  JWT: {
    SECRET: process.env.ACCESS_TOKEN_SECRET,
    EXPIRES_IN_SECONDS: ONE_MINUTE_IN_SECONDS * 15
  },

  REFRESH_TOKEN: {
    SECRET: process.env.REFRESH_TOKEN_SECRET,
    EXPIRES_IN_SECONDS: ONE_WEEK_IN_SECONDS,
    PATH: '/',
    HTTPONLY: true,
    SECURE: process.env.NODE_ENV === 'production',
    SAMESITE: 'lax'
  },

  PASSWORD_RESET: {
    SECRET: 'todo',
    EXPIRES_IN_SECONDS: ONE_MINUTE_IN_SECONDS * 30
  },

  MAILING: {
    MAILDEV: {
      HOST: process.env.MAILDEV_HOST,
      PORT: process.env.MAILDEV_SMTP_PORT
    },
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY
  },

  ENGINE_WORKERS: {
    MAX_INSTANCES: 10,
    SHUTDOWN_TIMEOUT: 5000
  }
});

export type Config = z.infer<typeof configSchema>;
