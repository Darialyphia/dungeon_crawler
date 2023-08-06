import { contract, type Contract } from '@dungeon-crawler/contract';
import { initClient, type InitClientArgs } from '@ts-rest/core';
import type { HttpService } from './api/http.service';
import { FetchError } from 'ofetch';

export type ApiClient = ReturnType<typeof initClient<Contract, InitClientArgs>>;

type Dependencies = { http: HttpService };

export const apiClient = ({ http }: Dependencies): ApiClient =>
  initClient(contract, {
    baseUrl: import.meta.env.VITE_API_URL,
    baseHeaders: {},
    credentials: 'include',
    api: async args => {
      try {
        const resp = await http.fetch.raw(args.path, {
          method: args.method,
          headers: args.headers,
          body: args.rawBody as any,
          query: args.rawQuery as any,
          credentials: args.credentials,
          signal: args.signal
        });

        return {
          status: resp.status,
          headers: resp.headers,
          body: resp._data
        };
      } catch (e) {
        const err = e as FetchError;
        return {
          status: err.status ?? 500,
          body: err.data,
          headers: err.response?.headers ?? new Headers()
        };
      }
    }
  });
