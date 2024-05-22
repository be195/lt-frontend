<script setup lang="ts">
const props = defineProps({
  loading: {
    type: Boolean
  },
  title: {
    default: 'Untitled',
    type: String
  },
  online: {
    default: false,
    type: Boolean
  }
});
</script>

<template lang="pug">
div(:class="{ stream: true, button: true, elevated: true, loading: props.loading }")
  template(v-if="!props.loading")
    .name
      span {{ props.title }}
    onlineindicator(:online="props.online")
  template(v-else)
    .name
      skeletonbox(height="1em")
    span.online
      skeletonbox
</template>

<style lang="scss" scoped src="@/assets/styles/components/panelstreamtile.scss"></style>