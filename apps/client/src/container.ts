import { createTypedContainer } from '@dungeon-crawler/shared';

import { authProviders } from './features/auth/providers';
import { coreProviders } from './features/core/providers';
import { userProviders } from './features/user/providers';
import { gameProviders } from './features/game/providers';

const dependencies = {
  ...authProviders,
  ...coreProviders,
  ...userProviders,
  ...gameProviders
};

export const container = createTypedContainer(dependencies);
export type Container = typeof container;
