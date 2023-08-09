import { PureAbility, ForcedSubject, FieldMatcher } from '@casl/ability';
import { Nullable } from '@dungeon-crawler/shared';
import { createAbility } from '../../utils/casl';
import { User, UserId } from './user.entity';

type Abilities = ['read' | 'edit', 'User' | (User & ForcedSubject<'User'>)];

export type UserAbility = PureAbility<Abilities>;
export type UserAbilityBuilder = {
  buildFor(user: Nullable<User>): Promise<UserAbility>;
};

export const fieldMatcher: FieldMatcher = fields => field => fields.includes(field);

export const userAbilityBuilder = (): UserAbilityBuilder => {
  const cache = new Map<UserId, UserAbility>();

  const unAuthenticatedAbility = createAbility<UserAbility>(({ cannot }) => {
    cannot('edit', 'User');
    cannot('read', 'User');
  });

  return {
    async buildFor(user) {
      if (!user) return unAuthenticatedAbility;

      if (!cache.has(user.id)) {
        const ability = createAbility<UserAbility>(({ can }) => {
          can('read', 'User', 'email', (subject: User) => {
            return subject.id === user?.id;
          });

          can('edit', 'User', (subject: User) => {
            return subject.id === user?.id;
          });
        });

        cache.set(user.id, ability);
      }

      return cache.get(user.id)!;
    }
  };
};
