<script setup lang="ts">
import { definePage } from 'vue-router/auto';

definePage({
  name: 'Lobbies'
});

const { data: lobbies } = useLobbies();
</script>

<template>
  <main class="container surface">
    <h2>Lobbies</h2>
    <pre>{{ lobbies }}</pre>
  </main>
</template>

<style scoped lang="postcss">
main {
  --container-size: var(--size-xl);
}
</style>
