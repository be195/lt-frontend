<script setup lang="ts">
const props = defineProps({
  id: {
    type: String,
    default: 'unknown'
  },
  class: {
    type: String
  },
  modelValue: {
    type: Boolean
  }
});

const emit = defineEmits([ 'update:modelValue' ]);

const givenClass = useClass(props.class);
</script>

<template lang="pug">
div(:class="Object.assign({ slider: true }, givenClass)")
  input(
    type="checkbox",
    :id="props.id",
    :checked="props.modelValue",
    @change="emit('update:modelValue', $event.target.checked)"
  )
  label(:for="props.id")
    slot
</template>

<style scoped lang="scss" src="@/assets/styles/components/slider.scss"></style>