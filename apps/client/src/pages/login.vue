<script setup lang="ts">
import { definePage } from 'vue-router/auto';

definePage({
  name: 'Login',
  meta: {
    publicOnly: true
  }
});
</script>

<template>
  <main class="grid place-content-center">
    <section class="surface">
      <h2>Login</h2>
      <LoginForm />

      <RouterLink v-slot="{ href, navigate }" custom :to="{ name: 'Register' }">
        <UiLinkButton :href="href" @click="navigate">I dont have an account</UiLinkButton>
      </RouterLink>
    </section>
  </main>
</template>
