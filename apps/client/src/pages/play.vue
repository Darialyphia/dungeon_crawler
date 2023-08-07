<script setup lang="ts">
import { definePage } from 'vue-router/auto';
import { GameClient } from '@dungeon-crawler/game-client';

definePage({
  name: 'Play',
  meta: {
    needsAuth: true
  }
});

const { data: session } = useSession();
const player = computed(() =>
  session.value
    ? {
        id: session.value?.id,
        name: session.value.name ?? 'Anonymous'
      }
    : null
);

const root = ref<HTMLElement>();

const { width, height } = useElementBounding(root);
</script>

<template>
  <main ref="root">
    <GameClient :height="height" :width="width" v-if="player" :player="player" />
  </main>
</template>

<style scoped lang="postcss">
main {
  --container-size: var(--size-xl);
}
</style>
