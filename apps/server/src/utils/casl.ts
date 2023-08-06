import {
  FieldMatcher,
  MatchConditions,
  PureAbility,
  AbilityBuilder
} from '@casl/ability';

export const fieldMatcher: FieldMatcher = fields => field => fields.includes(field);

export const conditionsMatcher = (matchConditions: unknown) =>
  matchConditions as MatchConditions;

export const buildOptions = { fieldMatcher, conditionsMatcher };

export const createAbility = <T extends PureAbility>(
  cb: (api: Pick<AbilityBuilder<T>, 'can' | 'cannot'>) => void
): T => {
  const { can, cannot, build } = new AbilityBuilder<T>(PureAbility as any); // idk man

  cb({ can, cannot });

  return build(buildOptions);
};
