<script setup lang="ts">
const props = defineProps({
  minWidth: {
    default: 80,
    type: Number
  },
  maxWidth: {
    default: 100,
    type: Number
  },
  width: {
    default: null,
    type: String
  },
  height: {
    default: '1em',
    type: String
  }
});

const computedWidth = computed(() => {
  const offset = props.maxWidth - props.minWidth;
  return props.width || `${props.minWidth + Math.floor(Math.random() * offset)}%`;
});
</script>

<template lang="pug">
span.skeleton-box(:style="{ height, width: computedWidth }")
  slot
</template>

<style lang="scss" scoped src="@/assets/styles/components/skeletonbox.scss"></style>