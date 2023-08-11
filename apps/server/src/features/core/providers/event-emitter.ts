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

class MyEmitter extends EventEmitter {
  emit(type: string, ...args: any[]) {
    console.log('EVENT EMITTER : ', type);
    return super.emit(type, ...args);
  }
}

export const emitter = new MyEmitter() as TypedEmitter<DomainEvents>;

emitter.setMaxListeners(100);
