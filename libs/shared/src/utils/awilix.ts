import {
  type AwilixContainer,
  createContainer,
  type Resolver,
  type ResolveOptions
} from 'awilix';

type ContainerDefinition = Record<string, Resolver<unknown>>;
type ExtractResolverType<T> = T extends Resolver<infer X> ? X : null;

export interface TypedAwilixContainer<T extends ContainerDefinition>
  extends Pick<AwilixContainer, Exclude<keyof AwilixContainer, 'resolve' | 'cradle'>> {
  resolve<K extends keyof T>(
    key: K,
    resolveOptions?: ResolveOptions
  ): ExtractResolverType<T[K]>;
  cradle: {
    [K in keyof T]: ExtractResolverType<T[K]>;
  };
}

export const createTypedContainer = <T extends ContainerDefinition>(
  registrations: T
): TypedAwilixContainer<T> => {
  const container = createContainer().register(registrations);

  return container;
};
