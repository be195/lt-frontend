<script setup lang="ts">
let show = ref(false);

defineEmits([ 'reveal' ]);
</script>

<template lang="pug">
div(:class="{ spoiler: true, show }")
  .content
    slot
  Transition(name="fade")
    .overlay(v-if="!show", @click="show = true, $emit('reveal')")
      eyenoneicon.icon
</template>

<style lang="scss" scoped src="@/assets/styles/components/spoiler.scss"></style>