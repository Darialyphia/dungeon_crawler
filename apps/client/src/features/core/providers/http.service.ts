import { ofetch, type FetchOptions, type $Fetch } from 'ofetch';

const requestInterceptors = new Set<FetchOptions['onRequest']>();
const requestErrorInterceptors = new Set<FetchOptions['onRequestError']>();
const responseInterceptors = new Set<FetchOptions['onResponse']>();
const responseErrorInterceptors = new Set<FetchOptions['onResponseError']>();

export type HttpService = {
  fetch: $Fetch;
  onRequest(listener: FetchOptions['onRequest']): void;
  onRequestError(listener: FetchOptions['onRequestError']): void;
  onResponse(listener: FetchOptions['onResponse']): void;
  onResponseError(listener: FetchOptions['onResponseError']): void;
};

export const httpService = (): HttpService => {
  const http = ofetch.create?.({
    retry: false,
    credentials: 'include',
    baseURL: import.meta.env.VITE_API_URL,
    async onRequest(ctx) {
      if (!ctx.options.headers) {
        ctx.options.headers = new Headers();
      }

      for (const cb of requestInterceptors.values()) {
        await cb?.(ctx);
      }
    },
    async onRequestError(ctx) {
      for (const cb of requestErrorInterceptors.values()) {
        await cb?.(ctx);
      }
    },
    async onResponse(ctx) {
      for (const cb of responseInterceptors.values()) {
        await cb?.(ctx);
      }
    },
    async onResponseError(ctx) {
      for (const cb of responseErrorInterceptors.values()) {
        await cb?.(ctx);
      }
    }
  });

  return {
    fetch: http,
    onRequest(listener: FetchOptions['onRequest']) {
      requestInterceptors.add(listener);
    },
    onRequestError(listener: FetchOptions['onRequestError']) {
      requestErrorInterceptors.add(listener);
    },
    onResponse(listener) {
      responseInterceptors.add(listener);
    },
    onResponseError(listener) {
      responseErrorInterceptors.add(listener);
    }
  };
};
