import { type IoEvents } from '@dungeon-crawler/contract';
import { io, type Socket } from 'socket.io-client';
import type { AuthApi } from '../auth/api/auth.api';

export type AppSocket = Socket<IoEvents['SERVER'], IoEvents['CLIENT']>;

export const createSocket = ({ authApi }: { authApi: AuthApi }) => {
  const socket: AppSocket = io(import.meta.env.VITE_API_URL, {
    transports: ['websocket'],
    autoConnect: false,
    auth: cb => cb({ token: authApi.getToken()?.accessToken })
  });

  return socket;
};
