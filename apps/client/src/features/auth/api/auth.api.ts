import jwtDecode from 'jwt-decode';
import type { ClientInferRequest, ClientInferResponses } from '@ts-rest/core';
import { queryKeys } from '@/features/core/queryKeys';
import type { HttpService } from '@/features/core/api/http.service';
import type { ApiClient } from '@/features/core/apiClient';
import { apiHandler } from '@/utils/api-helpers';
import { type AnyObject, type Nullable, ONE_MINUTE_IN_MS } from '@dungeon-crawler/shared';
import {
  authContract,
  TokenResponse,
  type AuthContract
} from '@dungeon-crawler/contract';
import type { QueryClient } from '@tanstack/vue-query';
import { updateSession } from '../utils/cache-utils';
import { authKeys } from '../utils/auth.keys';

export type LoginRequest = ClientInferRequest<AuthContract['login']>;
export type LoginResponse = ClientInferResponses<AuthContract['login'], 200>;
export type LogoutResponse = ClientInferResponses<AuthContract['logout'], 200>;
export type RefreshJwtResponse = ClientInferResponses<AuthContract['refresh'], 200>;
export type SessionResponse = ClientInferResponses<AuthContract['session'], 200>;

export type AuthApi = {
  login: (input: LoginRequest['body']) => Promise<LoginResponse['body']>;
  logout: () => Promise<LogoutResponse['body']>;
  refreshJwt: () => Promise<RefreshJwtResponse['body']>;
  session: () => Promise<SessionResponse['body']>;
  init: () => Promise<TokenResponse>;
  getToken: () => Nullable<{ accessToken: string }>;
};

export const REFRESH_ENDPOINT = authContract.refresh.path;
export const LOGIN_ENDPOINT = authContract.login.path;
export const LOGOUT_ENDPOINT = authContract.logout.path;
export const AUTH_HEADER = 'authorization';

type JwtPayload = {
  sub: string;
  iat: number;
  exp: number;
};

type Dependencies = { apiClient: ApiClient; http: HttpService; queryClient: QueryClient };

export const authApi = ({ apiClient, queryClient, http }: Dependencies): AuthApi => {
  const getToken = () =>
    queryClient.getQueryData<Nullable<LoginResponse['body']>>(
      queryKeys.auth.token.queryKey
    );
  const setToken = (val: Nullable<LoginResponse['body']>) =>
    queryClient.setQueryData(queryKeys.auth.token.queryKey, val);

  const getBearer = (token: string) => (token ? `Bearer ${token}` : '');

  const addHeaders = () => {
    http.onRequest(config => {
      const token = getToken();
      if (!token) return;

      const headers = config.options.headers as AnyObject;
      if (!headers[AUTH_HEADER]) {
        headers[AUTH_HEADER] = getBearer(token.accessToken);
      }
    });
  };

  const handleRedirects = () => {
    http.onResponse(({ response }) => {
      if (
        response.url.includes(LOGIN_ENDPOINT) ||
        response.url.includes(REFRESH_ENDPOINT)
      ) {
        return;
      }

      if (response.status === 401) {
        // window.location.href = '/login';
      }
    });
  };

  const checkJwtExpiration = (jwt: string) => {
    const decoded = jwtDecode<JwtPayload>(jwt);
    const now = new Date();
    const expirationDate = new Date(decoded.exp * 1000); // exp is in seconds
    const buffer = ONE_MINUTE_IN_MS;
    return now.getTime() + buffer > expirationDate.getTime();
  };

  const refreshJwt = async () => {
    const token = await apiHandler(apiClient.auth.refresh);
    setToken(token);

    return token;
  };

  const handleRefreshToken = () => {
    // keeping track of the refresh promise for deduping
    // we want to dedupe the refresh token call to ensure it's only called once when needed
    let ongoingRefreshPromise: Nullable<Promise<void>>;

    const refreshJwtIfExpired = async () => {
      const token = getToken();

      if (!token) return;

      const isExpired = checkJwtExpiration(token.accessToken);
      if (!isExpired) return;
      setToken(null);

      await refreshJwt();
    };

    http.onRequest(async config => {
      if (
        config.request.toString().includes(LOGIN_ENDPOINT) ||
        config.request.toString().includes(REFRESH_ENDPOINT)
      ) {
        return;
      }

      if (!ongoingRefreshPromise) {
        ongoingRefreshPromise = refreshJwtIfExpired();
      }

      await ongoingRefreshPromise;
      ongoingRefreshPromise = null;
    });
  };

  return {
    getToken,
    refreshJwt,

    init() {
      handleRefreshToken();
      addHeaders();
      handleRedirects();

      return refreshJwt();
    },

    async login(body) {
      const token = await apiHandler(apiClient.auth.login, { body });
      setToken(token);
      queryClient.invalidateQueries(authKeys.session.queryKey);

      return token;
    },

    async logout() {
      const response = await apiHandler(apiClient.auth.logout);
      setToken(null);
      updateSession(queryClient, null);

      return response;
    },

    session() {
      return apiHandler(apiClient.auth.session);
    }
  };
};
