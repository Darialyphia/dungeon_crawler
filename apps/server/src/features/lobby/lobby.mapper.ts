import { LobbyResponse } from '@dungeon-crawler/contract';
import { Lobby } from './lobby.entity';
import { UserMapper } from '../user/user.mapper';

export type LobbyMapper = {
  toResponse(lobby: Lobby): LobbyResponse;
  toResponseArray(lobbies: Lobby[]): LobbyResponse[];
};

type Dependencies = {
  userMapper: UserMapper;
};

export const lobbyMapper = ({ userMapper }: Dependencies): LobbyMapper => {
  const mapLobby = (lobby: Lobby): LobbyResponse => {
    return {
      id: lobby.id,
      name: lobby.name,
      author: userMapper.toResponse(lobby.author),
      createdAt: lobby.createdAt,
      capacity: lobby.capacity,
      participants: userMapper.toResponseArray(lobby.participants)
    };
  };

  return {
    toResponse(lobby) {
      return mapLobby(lobby);
    },

    toResponseArray(lobbies) {
      return lobbies.map(lobby => mapLobby(lobby));
    }
  };
};
