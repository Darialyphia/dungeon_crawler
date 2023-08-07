<script setup lang="ts">
import { authContract } from '@dungeon-crawler/contract';
import { toTypedSchema } from '@vee-validate/zod';
import { string } from 'zod';

definePage({
  name: 'ResetPassword',
  meta: {
    publicOnly: true
  }
});

const route = useRoute();

const formSchema = authContract.resetPassword.body
  .extend({
    passwordConfirm: string()
  })
  .refine(data => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ['passwordConfirm']
  });

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    email: route.query.email as string,
    token: route.query.token as string
  }
});

const { mutate, isLoading, error, isSuccess } = useResetPassword();
const onSubmit = handleSubmit(values => mutate(values));
</script>

<template>
  <main
    class="container surface place-self-center"
    style="--container-size: var(--size-sm)"
  >
    <div v-if="isSuccess" class="space-y-4">
      <h2>Password changed successfully !</h2>

      <p>
        You can now
        <RouterLink :to="{ name: 'Login' }" class="underline">
          sign in with your new password.
        </RouterLink>
      </p>
    </div>

    <form v-else class="space-y-4" @submit.prevent="onSubmit">
      <h2>Select your new password</h2>

      <UiFormControl v-slot="{ error: inputError, inputProps }" name="password">
        <UiFormLabel for="password">Password</UiFormLabel>
        <UiPasswordInput id="email" v-bind="inputProps" />
        <UiFormError :error="inputError" />
      </UiFormControl>

      <UiFormControl v-slot="{ error: inputError, inputProps }" name="passwordConfirm">
        <UiFormLabel for="password-confirm">Confirm your password</UiFormLabel>
        <UiPasswordInput id="password-confirm" v-bind="inputProps" />
        <UiFormError :error="inputError" />
      </UiFormControl>

      <UiButton :is-loading="isLoading">Next</UiButton>
      <UiFormError :error="error?.message" />
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
