import { asFunction } from 'awilix';
import { userRepository } from './user.repository';
import { signupUseCase } from './usecases/signup.usecase';
import { userMapper } from './user.mapper';
import { userAbilityBuilder } from './user.ability';
import { updateProfileUnseCase } from './usecases/updateProfile.usesase';

export const userProviders = {
  userRepo: asFunction(userRepository),
  userMapper: asFunction(userMapper),
  userAbilityBuilder: asFunction(userAbilityBuilder),

  signupUseCase: asFunction(signupUseCase),
  updateProfileUseCase: asFunction(updateProfileUnseCase)
};
