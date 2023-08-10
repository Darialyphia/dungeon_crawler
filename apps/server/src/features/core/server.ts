import { Express } from 'express';
import http from 'http';
import { GameSubscribers } from '../game/game.subscribers';

type Dependencies = { app: Express };
export const server = ({ app }: Dependencies) => {
  const server = http.createServer(app);

  return server;
};
