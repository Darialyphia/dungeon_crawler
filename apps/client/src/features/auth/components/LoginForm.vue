<script setup lang="ts">
import { authContract } from '@dungeon-crawler/contract';
import { toTypedSchema } from '@vee-validate/zod';

const {
  mutate: signup,
  isLoading,
  error
} = useLogin({
  onSuccess() {
    form.resetForm();
  }
});

const form = useForm({
  validationSchema: toTypedSchema(authContract.login.body)
});

const onSubmit = form.handleSubmit(values => signup(values));
</script>

<template>
  <form @submit.prevent="onSubmit">
    <UiFormControl v-slot="{ error, inputProps }" name="email">
      <UiFormLabel for="login-email">E-mail</UiFormLabel>
      <UiTextInput
        v-bind="inputProps"
        id="login-email"
        type="email"
        left-icon="mdi-email-outline"
      />
      <UiFormError :error="error" />
    </UiFormControl>

    <UiFormControl v-slot="{ error, inputProps }" name="password">
      <UiFormLabel for="login-password">Password</UiFormLabel>
      <UiPasswordInput
        id="login-password"
        v-bind="inputProps"
        left-icon="mdi:lock-outline"
      />
      <UiFormError :error="error" />
    </UiFormControl>

    <UiButton is-cta :disabled="isLoading">Sign up</UiButton>
    <UiFormError :error="error?.message" />
  </form>
</template>
