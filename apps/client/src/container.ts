import { createTypedContainer } from '@dungeon-crawler/shared';

import { authProviders } from './features/auth/providers';
import { coreProviders } from './features/core/providers';
import { userProviders } from './features/user/providers';
import { lobbyProviders } from './features/lobby/providers';

const dependencies = {
  ...authProviders,
  ...coreProviders,
  ...userProviders,
  ...lobbyProviders
};

export const container = createTypedContainer(dependencies);
export type Container = typeof container;
