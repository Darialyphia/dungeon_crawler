import { GameResponse } from '@dungeon-crawler/contract';
import { Game } from './game.entity';
import { UserMapper } from '../user/user.mapper';

export type GameMapper = {
  toResponse(game: Game): GameResponse;
  toResponseArray(games: Game[]): GameResponse[];
};

type Dependencies = {
  userMapper: UserMapper;
};

export const gameMapper = ({ userMapper }: Dependencies): GameMapper => {
  const mapGame = (game: Game): GameResponse => {
    return {
      id: game.id,
      name: game.name,
      author: userMapper.toResponse(game.author),
      createdAt: game.createdAt,
      capacity: game.capacity,
      players: userMapper.toResponseArray(game.players)
    };
  };

  return {
    toResponse(game) {
      return mapGame(game);
    },

    toResponseArray(games) {
      return games.map(game => mapGame(game));
    }
  };
};
