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
</script>

<template>
  <main class="container grid place-items-center">
    <GameClient :height="600" :width="800" v-if="player" :player="player" />
  </main>
</template>

<style scoped lang="postcss">
main {
  --container-size: var(--size-xl);
}
</style>
