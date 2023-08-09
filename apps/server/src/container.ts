import { Express } from 'express';
import { asFunction, asValue, Resolver } from 'awilix';
import {
  Nullable,
  TypedAwilixContainer,
  createTypedContainer
} from '@dungeon-crawler/shared';
import { User } from './features/user/user.entity';
import { authProviders } from './features/auth/auth.providers';
import { coreProviders } from './features/core/core.providers';
import { userProviders } from './features/user/user.providers';
import { lobbyProviders } from './features/lobby/lobby.providers';

const dependencies = {
  req: asValue(null),
  res: asValue(null),
  session: asValue(null),
  ...authProviders,
  ...coreProviders,
  ...userProviders,
  ...lobbyProviders
};

export const container = createTypedContainer(dependencies);

type Dependencies = typeof dependencies;
type RequestScopedDependencies = Omit<Dependencies, 'req' | 'res' | 'session'> & {
  session: Resolver<Nullable<User>>;
  req: Resolver<Express['request']>;
  res: Resolver<Express['response']>;
};

export type Container = typeof container;
export type RequestScopedContainer = TypedAwilixContainer<RequestScopedDependencies>;
