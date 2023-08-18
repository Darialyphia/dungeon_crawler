import { Nullable } from '@dungeon-crawler/shared';
import { Assets, Spritesheet } from 'pixi.js';
import { ASSET_BUNDLES, AssetBundle } from '../assets-manifest';
import { useSafeInject } from './useSafeInject';
import { MaybeRef } from 'vue';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BundlesCache = Record<AssetBundle, any>;

export const ASSET_CACHE_INJECTION_KEY = Symbol('asset_cache') as InjectionKey<{
  bundles: BundlesCache;
  loadBundle(name: AssetBundle): Promise<void>;
}>;

export const useAssetCacheProvider = () => {
  const bundles: BundlesCache = {
    [ASSET_BUNDLES.SPRITES]: null,
    [ASSET_BUNDLES.TILESETS]: null
  };

  const api = {
    bundles,
    async loadBundle(name: AssetBundle) {
      if (!bundles[name]) {
        bundles[name] = await Assets.loadBundle(name);
      }
    }
  };

  provide(ASSET_CACHE_INJECTION_KEY, api);

  return api;
};

export const useAssetCache = () => useSafeInject(ASSET_CACHE_INJECTION_KEY);

export const useSprite = (spriteName: MaybeRef<string>) => {
  const { bundles, loadBundle } = useAssetCache();

  loadBundle(ASSET_BUNDLES.SPRITES);

  const sheet = computed(() => {
    return bundles[ASSET_BUNDLES.SPRITES]?.[unref(spriteName)];
  });

  return { sheet };
};
