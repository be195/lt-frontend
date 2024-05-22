<script setup lang="ts">
const props = defineProps({
  class: {
    type: String
  }
});

const givenClass = useClass(props.class);
</script>

<template lang="pug">
div(:class="Object.assign({ grid: true }, givenClass)")
  slot
</template>

<style lang="scss" scoped>
.grid {
  display: grid;
  gap: var(--m-2);
  grid-template-columns: repeat(auto-fit, minmax(var(--grid-min-width, 200px), 1fr));
}
</style>