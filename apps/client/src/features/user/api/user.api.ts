import type { AuthApi } from '@/features/auth/api/auth.api';
import { authKeys } from '@/features/auth/utils/auth.keys';
import { updateSession } from '@/features/auth/utils/cache-utils';
import type { ApiClient } from '@/features/core/apiClient';
import { apiHandler } from '@/utils/api-helpers';
import type { UserContract, UserResponse } from '@dungeon-crawler/contract';
import type { QueryClient } from '@tanstack/vue-query';
import type { ClientInferRequest, ClientInferResponses } from '@ts-rest/core';

export type SignupRequest = ClientInferRequest<UserContract['signup']>;
export type SignupResponse = ClientInferResponses<UserContract['signup'], 201>;

export type UpdateProfileRequest = ClientInferRequest<UserContract['updateProfile']>;
export type UpdateProfileResponse = ClientInferResponses<
  UserContract['updateProfile'],
  200
>;

export type UserApi = {
  signup(input: SignupRequest['body']): Promise<SignupResponse['body']>;
  updateProfile(
    input: UpdateProfileRequest['body']
  ): Promise<UpdateProfileResponse['body']>;
};

export const userApi = ({
  apiClient,
  queryClient,
  authApi
}: {
  apiClient: ApiClient;
  queryClient: QueryClient;
  authApi: AuthApi;
}): UserApi => {
  return {
    async signup(body) {
      const result = await apiHandler(apiClient.user.signup, { body });

      authApi.login(body);

      return result;
    },

    async updateProfile(body) {
      const session = queryClient.getQueryData<UserResponse>(authKeys.session.queryKey);

      const result = await apiHandler(apiClient.user.updateProfile, {
        params: { userId: session!.id },
        body
      });

      updateSession(queryClient, result);

      return result;
    }
  };
};
