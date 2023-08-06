<script setup lang="ts">
import { Icon } from '@iconify/vue';

defineOptions({
  name: 'UiIcon'
});

const props = withDefaults(
  defineProps<{
    name: string;
    inline?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  }>(),
  { size: 'md' }
);
</script>

<template>
  <Icon
    :icon="props.name"
    class="ui-icon"
    :class="[props.size, { 'ui-icon--inline': props.inline }]"
    :inline="props.inline"
  />
</template>

<style scoped lang="postcss">
.ui-icon--inline {
  display: inline;
}

.ui-icon {
  flex-shrink: 0;
  &:where(.sm) {
    font-size: var(--font-size-1);
  }
  &:where(.md) {
    font-size: var(--font-size-4);
  }
  &:where(.lg) {
    font-size: var(--font-size-5);
  }
  &:where(.xl) {
    font-size: var(--font-size-6);
  }
  &:where(.xxl) {
    font-size: var(--font-size-7);
  }
}
</style>
