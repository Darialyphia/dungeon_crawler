<script setup lang="ts">
import type { Nullable } from '@dungeon-crawler/shared';

const props = defineProps<{
  name?: string;
  id: string;
  modelValue: Nullable<string>;
}>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const vModel = useVModel(props, 'modelValue', emit);
const isPasswordShown = ref(false);
const type = computed(() => (isPasswordShown.value ? 'text' : 'password'));

const slots = useSlots();
</script>

<template>
  <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
  <UiTextInput :id="props.id" v-model="vModel" :name="props.name" :type="type">
    <template v-if="slots.left" #left><slot name="left" /></template>

    <template #right>
      <UiIconButton
        type="button"
        :title="isPasswordShown ? 'hide password' : 'show password'"
        :icon="isPasswordShown ? 'mdi-eye-off' : 'mdi-eye'"
        @click="isPasswordShown = !isPasswordShown"
      />
    </template>
  </UiTextInput>
</template>

<i18n lang="json">
{
  "en": {
    "show": "Show password",
    "hide": "Hide Password"
  },
  "fr": {
    "show": "Montrer le mot de passe",
    "hide": "Masquer le mot de passe"
  }
}
</i18n>
