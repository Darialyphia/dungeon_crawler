import { isString } from '@dungeon-crawler/shared';
import type { LocationQuery } from 'vue-router/auto';
import type { LocationQueryValue } from 'vue-router/auto';
import type { RouteMeta } from 'vue-router/auto';
import type { RouteNamedMap } from 'vue-router/auto/routes';

type RouteName = keyof RouteNamedMap & {};

export const useAuthGuard = () => {
  const router = useRouter();

  const isAuthenticated = useIsAuthenticated();

  const getRedirectUrl = (
    meta: RouteMeta,
    currentPath: string,
    from: LocationQueryValue | LocationQueryValue[]
  ): { name: RouteName; query?: LocationQuery } | string | undefined => {
    const isAuth = isAuthenticated.value;
    if (meta.needsAuth && !isAuth) {
      return {
        name: 'Login',
        query: { from: encodeURIComponent(currentPath) }
      };
    }

    if (meta.publicOnly && isAuth) {
      if (isString(from)) return decodeURIComponent(from);
      return {
        name: 'Home'
      };
    }
  };

  router.beforeEach((to, from, next) => {
    const redirectUrl = getRedirectUrl(to.meta, to.fullPath, from.query.from);

    if (redirectUrl) return next(redirectUrl);

    return next();
  });

  const check = () => {
    const redirectUrl = getRedirectUrl(
      router.currentRoute.value.meta,
      router.currentRoute.value.fullPath,
      router.currentRoute.value.query.from
    );

    if (redirectUrl) router.push(redirectUrl as any);
  };

  router.isReady().then(check);
  watch(isAuthenticated, check);
};
