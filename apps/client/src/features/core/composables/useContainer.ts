import type { Container } from '@/container';
import type { InjectionKey } from 'vue';

export const CONTAINER_INJECTION_KEY = Symbol('container') as InjectionKey<
  Container['cradle']
>;

export const useContainer = () => useSafeInject(CONTAINER_INJECTION_KEY);
