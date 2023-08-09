import { UnexpectedError } from '../../../utils/errorFactory';
import { UseCase } from '../../../utils/helpers';
import { Game } from '../game.entity';
import { GameRepository } from '../game.repository';

export type GetAllGamesUseCaseError = UnexpectedError;

export type GetAllGamesUseCase = UseCase<void, Game[], GetAllGamesUseCaseError>;

type Dependencies = {
  gameRepo: GameRepository;
};

export const getAllGamesUsecase =
  ({ gameRepo }: Dependencies): GetAllGamesUseCase =>
  async () =>
    gameRepo.findAll();
