import http from 'http';
import { app } from './app';

export type Server = http.Server;

export const server = http.createServer(app);
