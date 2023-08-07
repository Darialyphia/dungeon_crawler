import type { ApiClient } from '@/features/core/providers/apiClient';
import { apiHandler } from '@/utils/api-helpers';
import type { AuthContract } from '@dungeon-crawler/contract';
import type { ClientInferRequest, ClientInferResponses } from '@ts-rest/core';

export type ForgotPasswordRequest = ClientInferRequest<AuthContract['forgotPassword']>;
export type ForgotPasswordResponse = ClientInferResponses<
  AuthContract['forgotPassword'],
  200
>;

export type ResetPasswordRequest = ClientInferRequest<AuthContract['resetPassword']>;
export type ResetPasswordResponse = ClientInferResponses<
  AuthContract['resetPassword'],
  200
>;

export type PasswordResetApi = {
  forgotPassword(
    input: ForgotPasswordRequest['body']
  ): Promise<ForgotPasswordResponse['body']>;
  reset(input: ResetPasswordRequest['body']): Promise<ResetPasswordResponse['body']>;
};

export const passwordResetApi = ({
  apiClient
}: {
  apiClient: ApiClient;
}): PasswordResetApi => {
  return {
    async forgotPassword(body) {
      return apiHandler(apiClient.auth.forgotPassword, { body });
    },

    async reset(body) {
      return apiHandler(apiClient.auth.resetPassword, { body });
    }
  };
};
