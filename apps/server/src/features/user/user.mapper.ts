import { Nullable } from '@dungeon-crawler/shared';
import { UserResponse } from '@dungeon-crawler/contract';
import { User } from './user.entity';
import { UserAbility, UserAbilityBuilder } from './user.ability';
import { subject } from '@casl/ability';
import { User as PrismaUser } from '@prisma/client';

export type UserMapper = {
  toResponse(user: User): UserResponse;
  toResponseArray(user: User[]): UserResponse[];
  toDomain(user: PrismaUser): User;
};

type Dependencies = { userAbilityBuilder: UserAbilityBuilder; session: Nullable<User> };

export const userMapper = ({ userAbilityBuilder, session }: Dependencies): UserMapper => {
  const mapuser = (user: User, ability: UserAbility): UserResponse => {
    return {
      id: user.id,
      email: ability.can('read', subject('User', user)) ? user.email : undefined,
      name: user.name
    };
  };

  return {
    toResponse(user) {
      return mapuser(user, userAbilityBuilder.buildFor(session));
    },

    toResponseArray(users) {
      const ability = userAbilityBuilder.buildFor(session);
      return users.map(user => mapuser(user, ability));
    },

    toDomain(user) {
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        passwordHash: user.passwordHash
      };
    }
  };
};
