<script setup lang="ts">
import { definePage } from 'vue-router/auto';
import { GameClient } from '@dungeon-crawler/game-client';
import type { SerializedGameState } from '@dungeon-crawler/game-engine';

definePage({
  name: 'Play',
  meta: {
    needsAuth: true
  }
});

const route = useRoute('Play');
const { data: session } = useSession();
const { mutate: join, data: game, error } = useJoinGame();
const { mutate: leave } = useLeaveGame();

join(route.params.id);

const root = ref<HTMLElement>();
const { width, height } = useElementBounding(root);
const gameState = ref<SerializedGameState>();

const { socket } = useContainer();
socket.on('GAME_STATE_UPDATE', ({ gameId, state }) => {
  if (gameId !== game.value?.id) return;
  gameState.value = state;
});

const isGameReady = computed(() => {
  return session.value && game.value && gameState.value;
});

onUnmounted(() => {
  if (game.value) {
    leave(game.value?.id);
  }
});
</script>

<template>
  <main ref="root">
    <GameClient
      v-if="isGameReady"
      :height="height"
      :width="width"
      :player-id="session!.id"
      :state="gameState!"
      @game:event="socket.emit('GAME_ACTION', { gameId: game!.id, action: $event })"
    />
    <div v-else-if="error" class="container color-red-6">
      {{ error.kind }}
      <RouterLink :to="{ name: 'Games' }" custom v-slot="{ href, navigate }">
        <UiButton :href="href" @click="navigate" class="w-fit">Back to list</UiButton>
      </RouterLink>
    </div>
    <div v-else>Connecting to game...</div>
  </main>
</template>

<style scoped lang="postcss">
main {
  --container-size: var(--size-xl);
}
</style>
