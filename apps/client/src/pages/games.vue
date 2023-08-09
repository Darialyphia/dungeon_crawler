<script setup lang="ts">
import { definePage } from 'vue-router/auto';

definePage({
  name: 'Games'
});

const { data: games } = useGames();
</script>

<template>
  <main class="container surface">
    <h2>Lobbies</h2>
    <pre>{{ games }}</pre>
  </main>
</template>

<style scoped lang="postcss">
main {
  --container-size: var(--size-xl);
}
</style>
