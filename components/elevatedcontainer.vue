<script setup lang="ts">
const props = defineProps({
  class: {
    type: String
  },
  glass: {
    type: Boolean,
    default: false
  }
});

const givenClass = useClass(props.class);
</script>

<template lang="pug">
div(:class="Object.assign({ container: true, glass: props.glass }, givenClass)")
  slot
</template>

<style scoped lang="scss">
:global(:root) {
  --elevated-container-default-background: var(--background-elevated-base);
  --elevated-container-default-border-color: var(--background-elevated-highlight);
  --elevated-container-glass-background: rgba(var(--background-elevated-base-guts), 0.6);
  --elevated-container-glass-border-color: var(--background-elevated-highlight);
}

.container {
  padding: var(--p-4);
  background: var(--elevated-container-default-background);
  border: 1px solid var(--elevated-container-default-border-color);
  border-radius: var(--border-radius);

  &.glass {
    backdrop-filter: var(--blur-size);
    background: var(--elevated-container-glass-background);
    border-color: var(--elevated-container-glass-border-color);
  }

  :deep(span) {
    color: var(--text-subdued);
  }
}
</style>