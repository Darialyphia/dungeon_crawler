import { PureAbility, ForcedSubject, FieldMatcher } from '@casl/ability';
import { Nullable } from '@dungeon-crawler/shared';
import { createAbility } from '../../utils/casl';
import { User } from './user.entity';

type Abilities = ['read' | 'edit', 'User' | (User & ForcedSubject<'User'>)];

export type UserAbility = PureAbility<Abilities>;
export type UserAbilityBuilder = {
  buildFor(user: Nullable<User>): UserAbility;
};

export const fieldMatcher: FieldMatcher = fields => field => fields.includes(field);

export const userAbilityBuilder = (): UserAbilityBuilder => {
  return {
    buildFor(user) {
      return createAbility<UserAbility>(({ can }) => {
        can('read', 'User', 'email', (subject: User) => {
          return subject.id === user?.id;
        });

        can('edit', 'User', (subject: User) => {
          return subject.id === user?.id;
        });
      });
    }
  };
};
