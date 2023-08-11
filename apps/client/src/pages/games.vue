<script setup lang="ts">
import { gameContract, MAX_USERS_PER_GAME } from '@dungeon-crawler/contract';
import { toTypedSchema } from '@vee-validate/zod';
import { definePage } from 'vue-router/auto';

definePage({
  name: 'Games'
});

const { data: games, isLoading } = useGames();
const router = useRouter();
const {
  mutate: create,
  isLoading: isCreating,
  error
} = useCreateGame({
  onSuccess(data) {
    router.push({ name: 'Play', params: { id: data.id } });
  }
});

const form = useForm({
  validationSchema: toTypedSchema(gameContract.create.body),
  initialValues: {
    capacity: 4
  }
});

const onSubmit = form.handleSubmit(values => create(values));
</script>

<template>
  <main class="container">
    <section class="surface">
      <h2>Games</h2>
      <p v-if="isLoading">Loading...</p>
      <p v-if="!games?.length">There are no ongoing games</p>
      <ul v-else>
        <li v-for="game in games" :key="game.id" class="flex gap-2 items-center">
          {{ game.name }} ({{ game.players.length }}/{{ game.capacity }})

          <RouterLink
            v-slot="{ href, navigate }"
            custom
            :to="{ name: 'Play', params: { id: game.id } }"
          >
            <UiButton
              :href="href"
              @click="navigate"
              :disabled="game.players.length >= game.capacity"
            >
              Join game
            </UiButton>
          </RouterLink>
        </li>
      </ul>
    </section>

    <form class="surface" @submit.prevent="onSubmit">
      <h2>Create game</h2>
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

      <UiButton is-cta :disabled="isCreating">Start game</UiButton>
      <UiFormError :error="error?.message" />
    </form>
  </main>
</template>

<style scoped lang="postcss">
main {
  --container-size: var(--size-lg);

  @screen md {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: var(--size-4);
  }
}

form {
  align-self: start;
}
</style>
