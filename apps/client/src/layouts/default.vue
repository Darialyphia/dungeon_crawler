<script setup lang="ts">
const { data: session } = useSession();

const { mutate: logout, isLoading } = useLogout();

const header = ref();
const headerHeight = useCssVar('--header-height');

useResizeObserver(header, entries => {
  const entry = entries[0];
  const { height } = entry.contentRect;
  headerHeight.value = `${height}px`;
});
</script>

<template>
  <div class="default-layout">
    <header class="container px-7" style="--container-size: var(--size-xl)" ref="header">
      <h1>
        <RouterLink :to="{ name: 'Home' }">Dungeon Crawler</RouterLink>
      </h1>
      <div class="ml-auto">
        <DarkModeToggle />
      </div>

      <template v-if="session">
        Welcome back, {{ session.name }}
        <UiLinkButton @click="logout(undefined)" :is-loading="isLoading">
          Logout
        </UiLinkButton>
        <RouterLink v-slot="{ href, navigate }" :to="{ name: 'Play' }" custom>
          <UiLinkButton :href="href" @click="navigate">Play</UiLinkButton>
        </RouterLink>
      </template>
      <UiLinkButton v-else :to="{ name: 'Login' }">Login</UiLinkButton>
    </header>
    <router-view />
  </div>
</template>

<style scoped lang="postcss">
.default-layout {
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: 100vh;
  min-height: 100dvh;
}
header {
  display: flex;
  gap: var(--size-5);
  align-items: center;
}

h1 {
  font-size: var(--font-size-5);
}

h1 :is(a, a:hover, a:visited) {
  text-decoration: none;
  color: inherit;
}
</style>
