import { Express } from 'express';
import http from 'http';

type Dependencies = { app: Express };
export const server = ({ app }: Dependencies) => {
  return http.createServer(app);
};
