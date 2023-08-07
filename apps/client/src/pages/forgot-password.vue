<script setup lang="ts">
definePage({
  name: 'ForgotPassword',
  meta: {
    publicOnly: true
  }
});

const { error, isSuccess, isLoading, mutate } = useForgotPassword();

const email = ref('');

const onSubmit = () => {
  mutate({ email: email.value });
};
</script>

<template>
  <main
    class="container surface place-self-center"
    style="--container-size: var(--size-sm)"
  >
    <div v-if="isSuccess" class="space-y-4">
      <h2>All done !</h2>

      <p>
        The e-mail will be sent shortly (usually instantly) to
        <span class="font-600">{{ email }}</span>
        . Click the link inside it to choose a new password.
      </p>
    </div>

    <form v-else class="space-y-4" @submit.prevent="onSubmit">
      <h2>Forgot your password ?</h2>
      <p>Fill the form below to receive an email with a link to choose a new password</p>

      <fieldset class="space-y-2">
        <UiFormLabel for="email">Enter your email address</UiFormLabel>
        <UiTextInput id="email" v-model="email" />
        <UiFormError v-if="error" :error="error.message" />
      </fieldset>

      <footer>
        <RouterLink :to="{ name: 'Register' }" custom v-slot="{ href, navigate }">
          <UiLinkButton :href="href" @click="navigate">Back to login page</UiLinkButton>
        </RouterLink>
        <UiButton :is-loading="isLoading">Next</UiButton>
      </footer>
    </form>
  </main>
</template>

<style scoped lang="postcss">
h2 {
  font-size: var(--font-size-5);
  font-weight: var(--font-weight-6);
}

footer {
  display: flex;
  gap: var(--size-3);
  align-items: center;
  justify-content: flex-end;
}
</style>
