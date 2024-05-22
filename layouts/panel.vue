<script setup lang="ts">

useHead({
  titleTemplate(title?: string) {
    if (title)
      return title + ' - Live Tucker Reaction';
    return 'Live Tucker Reaction';
  }
});
</script>

<template lang="pug">
.layout
  navbar
  .app
    // TODO: look for a therapist
    drawer
    draweroverlay
    .view
      slot
</template>

<style lang="scss" scoped src="@/assets/styles/layouts/panel.scss"></style>