<template>
  <ArkDialogTitle as-child>
    <header>
      <slot />
      <ArkDialogCloseTrigger>
        <UiIconButton icon="material-symbols:close" title="close" />
      </ArkDialogCloseTrigger>
    </header>
  </ArkDialogTitle>
</template>

<style scoped lang="postcss">
header {
  position: sticky;
  top: 0;

  display: flex;
  justify-content: space-between;

  padding: var(--size-2) var(--size-3);

  font-size: var(--font-size-4);
  font-weight: var(--font-weight-5);
}

[data-part='close-trigger'] {
  padding: 0;
}
</style>
