import { GameResponse } from '@dungeon-crawler/contract';
import { Game } from './game.entity';
import { UserMapper } from '../user/user.mapper';

export type GameMapper = {
  toResponse(game: Game): Promise<GameResponse>;
  toResponseArray(games: Game[]): Promise<GameResponse[]>;
};

type Dependencies = {
  userMapper: UserMapper;
};

export const gameMapper = ({ userMapper }: Dependencies): GameMapper => {
  const mapGame = async (game: Game): Promise<GameResponse> => {
    return {
      id: game.id,
      name: game.name,
      author: await userMapper.toResponse(game.author),
      createdAt: game.createdAt,
      capacity: game.capacity,
      players: await userMapper.toResponseArray(game.players)
    };
  };

  return {
    toResponse(game) {
      return mapGame(game);
    },

    toResponseArray(games) {
      return Promise.all(games.map(game => mapGame(game)));
    }
  };
};
