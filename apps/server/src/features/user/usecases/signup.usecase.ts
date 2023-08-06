import { userContract } from '@dungeon-crawler/contract';
import { ServerInferRequest } from '@ts-rest/core';
import { BadRequestError, UnexpectedError } from '../../../utils/errorFactory';
import { User } from '../user.entity';
import { UserRepository } from '../user.repository';
import { hash } from 'bcryptjs';
import { UseCase } from '../../../utils/helpers';

export type SignupInput = ServerInferRequest<typeof userContract.signup>['body'];
export type SignupUseCaseError = UnexpectedError | BadRequestError;

export type SignupUseCase = UseCase<SignupInput, User, SignupUseCaseError>;

type Dependencies = { userRepo: UserRepository };

export const signupUseCase =
  ({ userRepo }: Dependencies): SignupUseCase =>
  async ({ password, ...input }) => {
    return userRepo.create({ ...input, passwordHash: await hash(password, 10) });
  };
