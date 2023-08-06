<script setup lang="ts">
const { data: session } = useSession();

const isOpened = computed(() => !!session.value && !session.value.name);

const { mutate, isLoading, error } = useUpdateProfile();

const username = ref('');
</script>

<template>
  <UiModal id="tos" v-model:is-opened="isOpened" :is-closable="false">
    <template #content>
      <UiModalHeader>Welcome to Idle Game !</UiModalHeader>
      <form @submit="mutate({ name: username })">
        <UiModalContent>
          <p class="mbe-6">
            Please choose a username below to start your journey and slay your foes ! You
            will be able to change this username at any time.
          </p>

          <UiFormLabel for="onboarding-username">Select your username</UiFormLabel>
          <UiTextInput v-model="username" id="onboarding-username" />
          <UiFormError :error="error?.kind" />

          <footer>
            <UiButton :is-loading="isLoading">Continue</UiButton>
          </footer>
        </UiModalContent>
      </form>
    </template>
  </UiModal>
</template>

<style scoped lang="postcss">
footer {
  position: sticky;
  bottom: 0;

  display: flex;
  justify-content: flex-end;

  padding: var(--size-4) var(--size-2);

  background-color: var(--surface-1);
}
</style>

<i18n lang="json">
{
  "en": {
    "title": "Almost There !",
    "subtitle": "Please accept our updated terms and conditions to continue",
    "accept": "Accept",
    "decline": "Decline"
  },
  "fr": {
    "title": "Vous y êtes presque !",
    "subtitle": "Veuillez accepter nos conditions d'utilisation pour continuer",
    "accept": "J'accepte",
    "decline": "Je refuse"
  }
}
</i18n>
