import { ServerInferRequest } from '@ts-rest/core';
import { User, UserId } from '../user.entity';
import { Nullable } from '@dungeon-crawler/shared';
import { UserContract } from '@dungeon-crawler/contract';
import {
  ForbiddenError,
  NotFoundError,
  UnexpectedError,
  errorFactory
} from '../../../utils/errorFactory';
import { UseCase } from '../../../utils/helpers';
import { UserAbilityBuilder } from '../user.ability';
import { UserRepository } from '../user.repository';
import { subject } from '@casl/ability';
import { left } from 'fp-ts/Either';

export type UpdateProfileUseCaseInput = {
  userId: UserId;
  profile: ServerInferRequest<UserContract['updateProfile']>['body'];
};
export type UpdateProfileUseCase = UseCase<
  UpdateProfileUseCaseInput,
  User,
  UnexpectedError | NotFoundError | ForbiddenError
>;

type Dependencies = {
  userAbilityBuilder: UserAbilityBuilder;
  session: Nullable<User>;
  userRepo: UserRepository;
};

export const updateProfileUnseCase =
  ({ userAbilityBuilder, userRepo, session }: Dependencies): UpdateProfileUseCase =>
  async ({ userId, profile }) => {
    const userAbility = await userAbilityBuilder.buildFor(session);

    if (!userAbility.can('edit', subject('User', { id: userId } as User))) {
      return Promise.resolve(left(errorFactory.forbidden()));
    }

    return userRepo.updateProfileById(userId, profile);
  };
