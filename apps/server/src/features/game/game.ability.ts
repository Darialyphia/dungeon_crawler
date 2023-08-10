import { PureAbility, ForcedSubject, FieldMatcher } from '@casl/ability';
import { Nullable } from '@dungeon-crawler/shared';
import { createAbility } from '../../utils/casl';
import { Game } from './game.entity';
import { User, UserId } from '../user/user.entity';
import { GameRepository } from './game.repository';
import * as E from 'fp-ts/Either';

type Abilities = [
  'read' | 'join' | 'leave' | 'create',
  'Game' | (Game & ForcedSubject<'Game'>)
];

export type GameAbility = PureAbility<Abilities>;
export type GameAbilityBuilder = {
  buildForUser(user: Nullable<User>): Promise<GameAbility>;
};

type Dependencies = {
  gameRepo: GameRepository;
};

export const gameAbilityBuilder = ({ gameRepo }: Dependencies): GameAbilityBuilder => {
  const cache = new Map<UserId, GameAbility>();

  const unAuthenticatedAbility = createAbility<GameAbility>(({ cannot }) => {
    cannot('read', 'Game');
    cannot('create', 'Game');
    cannot('join', 'Game');
    cannot('leave', 'Game');
  });

  return {
    async buildForUser(user) {
      if (!user) return unAuthenticatedAbility;
      if (!cache.has(user.id)) {
        const [createdGame, joinedGame] = await Promise.all([
          gameRepo.findByAuthorId(user.id),
          gameRepo.findByPlayerId(user.id)
        ]);

        const ability = createAbility<GameAbility>(({ can, cannot }) => {
          can('read', 'Game');

          if (E.isLeft(createdGame) && E.isLeft(joinedGame)) {
            can('create', 'Game');
          }

          can('join', 'Game');
          cannot('join', 'Game', () => E.isRight(joinedGame));
          cannot(
            'join',
            'Game',
            (subject: Game) => subject.players.length >= subject.capacity
          );
          cannot('join', 'Game', (subject: Game) =>
            subject.players.some(p => p.id === user.id)
          );

          can('leave', 'Game');
          cannot(
            'leave',
            'Game',
            (subject: Game) => !subject.players.some(p => p.id === user.id)
          );
        });

        cache.set(user.id, ability);
      }

      return cache.get(user.id)!;
    }
  };
};
