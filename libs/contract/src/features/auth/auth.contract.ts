import { initContract } from '@ts-rest/core';
import { DefaultResponse, ErrorResponse } from '../core';
import { z } from 'zod';
import { TokenResponse } from './auth.schemas';
import { UserPassword, UserResponse } from '../user/user.schemas';

const c = initContract();

export const authContract = c.router(
  {
    login: {
      method: 'POST',
      path: '/login',
      responses: {
        200: TokenResponse,
        401: ErrorResponse,
        500: ErrorResponse
      },
      body: z.object({
        email: z.string(),
        password: z.string()
      }),
      metadata: { public: true }
    },
    logout: {
      method: 'POST',
      path: '/logout',
      responses: {
        200: DefaultResponse,
        500: ErrorResponse
      },
      body: null
    },
    refresh: {
      method: 'POST',
      path: '/refresh',
      responses: {
        200: TokenResponse,
        401: ErrorResponse,
        500: ErrorResponse
      },
      body: null,
      metadata: { public: true }
    },
    session: {
      method: 'GET',
      path: '/me',
      responses: {
        200: UserResponse,
        401: ErrorResponse,
        500: ErrorResponse
      }
    },
    forgotPassword: {
      method: 'POST',
      path: '/forgot-password',
      responses: {
        200: DefaultResponse,
        404: ErrorResponse,
        500: ErrorResponse
      },
      body: z.object({
        email: z.string()
      })
    },
    resetPassword: {
      method: 'POST',
      path: '/reset-password',
      responses: {
        200: DefaultResponse,
        404: ErrorResponse,
        401: ErrorResponse,
        500: ErrorResponse
      },
      body: z.object({
        password: UserPassword,
        token: z.string(),
        email: z.string()
      })
    }
  },
  {
    strictStatusCodes: true,
    pathPrefix: '/auth'
  }
);

export type AuthContract = typeof authContract;
