import {
  UnauthorizedError,
  UnexpectedError,
  errorFactory
} from '../../../utils/errorFactory';
import { UserRepository } from '../../user/user.repository';
import { UseCase } from '../../../utils/helpers';
import { isLeft, left } from 'fp-ts/Either';
import { AccessToken, TokenService } from '../token.service';
import { User } from '../../user/user.entity';

export type AuthenticateInput = AccessToken;
export type AuthenticateUseCaseError = UnexpectedError | UnauthorizedError;

export type AuthenticateUseCase = UseCase<
  AuthenticateInput,
  User,
  AuthenticateUseCaseError
>;

type Dependencies = {
  tokenService: TokenService;
  userRepo: UserRepository;
};

export const authenticateUsecase =
  ({ tokenService, userRepo }: Dependencies): AuthenticateUseCase =>
  async accessToken => {
    const verified = tokenService.verifyAccessToken(accessToken);
    if (isLeft(verified)) return verified;

    const user = await userRepo.findById(verified.right.sub as string);
    if (isLeft(user)) return left(errorFactory.unauthorized());

    return user;
  };
