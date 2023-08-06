<script setup lang="ts">
import { definePage } from 'vue-router/auto';

definePage({
  name: 'Register',
  meta: {
    publicOnly: true
  }
});
</script>

<template>
  <main class="grid place-content-center">
    <section class="surface">
      <h2>Sign up</h2>
      <SignupForm />

      <RouterLink v-slot="{ href, navigate }" custom :to="{ name: 'Login' }">
        <UiLinkButton :href="href" @click="navigate">
          I already have an account
        </UiLinkButton>
      </RouterLink>
    </section>
  </main>
</template>

<style scoped lang="postcss"></style>
