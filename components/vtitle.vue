<script setup lang="ts">
const props = defineProps({
  rich: {
    type: Boolean,
    default: false
  }
});
</script>

<template lang="pug">
div(:class="{ title: true, rich }")
  slot(name="icon")
  slot
  .right(v-if="rich")
    slot(name="right")
</template>

<style scoped lang="scss">
@import '@/node_modules/rfs/scss';

.title {
  @include font-size(1.5rem);
  margin-bottom: var(--m-2);
  flex-direction: row;
  align-items: center;
  gap: var(--m-1);

  &.rich {
    display: flex;
  }

  :deep(> svg) {
    width: auto;
    height: 1em;
  }

  .right {
    margin-left: auto;

    :deep(> .button svg) {
      height: calc(var(--button-icon-size) - 4px); // bruteforced, i know
      width: auto;
    }
  }
}
</style>