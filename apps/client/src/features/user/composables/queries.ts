import type { UseApiMutationOptions } from '@/features/core/composables/useApiQuery';
import { contract, type Contract } from '@dungeon-crawler/contract';
import type { UserApi } from '../api/user.api';

export const useSignup = (
  options: UseApiMutationOptions<Contract['user']['signup'], UserApi['signup']> = {}
) => {
  const { userApi } = useContainer();

  return useApiMutation(contract.user.signup, userApi.signup, options);
};

export const useUpdateProfile = (
  options: UseApiMutationOptions<
    Contract['user']['updateProfile'],
    UserApi['updateProfile']
  > = {}
) => {
  const { userApi } = useContainer();

  return useApiMutation(contract.user.updateProfile, userApi.updateProfile, options);
};
