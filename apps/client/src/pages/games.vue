<script setup lang="ts">
import { gameContract, MAX_USERS_PER_GAME } from '@dungeon-crawler/contract';
import { toTypedSchema } from '@vee-validate/zod';
import { definePage } from 'vue-router/auto';

definePage({
  name: 'Games'
});

const { data: games } = useGames();
const router = useRouter();
const {
  mutate: create,
  isLoading,
  error
} = useCreateGame({
  onSuccess(data) {
    router.push({ name: 'Play', params: { id: data.id } });
  }
});

const form = useForm({
  validationSchema: toTypedSchema(gameContract.create.body)
});

const onSubmit = form.handleSubmit(values => create(values));
</script>

<template>
  <main class="container surface">
    <h2>Games</h2>
    <pre>{{ games }}</pre>
    <h2>Create game</h2>
    <form @submit.prevent="onSubmit">
      <UiFormControl v-slot="{ error, inputProps }" name="name">
        <UiFormLabel for="create-game-name">Name</UiFormLabel>
        <UiTextInput v-bind="inputProps" id="create-game-name" autocomplete="off" />
        <UiFormError :error="error" />
      </UiFormControl>

      <UiFormControl v-slot="{ error, inputProps }" name="capacity">
        <UiFormLabel for="create-game-capacity">Capacity</UiFormLabel>
        <UiTextInput
          id="create-game-capacity"
          v-bind="inputProps"
          type="number"
          :max="MAX_USERS_PER_GAME"
        />
        <UiFormError :error="error" />
      </UiFormControl>

      <UiButton is-cta :disabled="isLoading">Start game</UiButton>
      <UiFormError :error="error?.message" />
    </form>
  </main>
</template>

<style scoped lang="postcss">
main {
  --container-size: var(--size-xl);
}
</style>
