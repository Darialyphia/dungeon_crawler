import { asValue, asFunction, Lifetime } from 'awilix';
import { apiClient } from './apiClient';
import { queryClient } from './queryClient';
import { createSocket } from './socket';
import { httpService } from './api/http.service';

export const coreProviders = {
  apiClient: asFunction(apiClient, { lifetime: Lifetime.SINGLETON }),
  queryClient: asValue(queryClient),
  socket: asFunction(createSocket, { lifetime: Lifetime.SINGLETON }),
  http: asFunction(httpService, { lifetime: Lifetime.SINGLETON })
};
