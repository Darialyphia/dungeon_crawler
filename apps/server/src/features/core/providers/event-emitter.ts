import EventEmitter from 'events';
import TypedEmitter from 'typed-emitter';
import { Game } from '../../game/game.entity';
import { User, UserId } from '../../user/user.entity';

export type DomainEvents = {
  GAME_CREATED(game: Game): void;
  USER_JOINED_GAME(payload: { game: Game; user: User }): void;
  USER_LEFT_GAME(payload: { game: Game; user: User }): void;
};

export type Emitter = TypedEmitter<DomainEvents>;

export const emitter = new EventEmitter() as TypedEmitter<DomainEvents>;
emitter.setMaxListeners(100);
