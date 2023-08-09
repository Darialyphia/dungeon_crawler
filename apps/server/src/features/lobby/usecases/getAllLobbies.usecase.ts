import { UnexpectedError } from '../../../utils/errorFactory';
import { UseCase } from '../../../utils/helpers';
import { Lobby } from '../lobby.entity';
import { LobbyRepository } from '../lobby.repository';

export type GetAllLobbiesUseCaseError = UnexpectedError;

export type GetAllLobbiesUseCase = UseCase<void, Lobby[], GetAllLobbiesUseCaseError>;

type Dependencies = {
  lobbyRepo: LobbyRepository;
};

export const getAllLobbiesUsecase =
  ({ lobbyRepo }: Dependencies): GetAllLobbiesUseCase =>
  async () =>
    lobbyRepo.findAll();
