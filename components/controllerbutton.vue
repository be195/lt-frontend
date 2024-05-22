<script lang="ts" setup>
const icons = {
  chatbubbleicon: resolveComponent('chatbubbleicon'),
  crossicon: resolveComponent('crossicon'),
  expandlessicon: resolveComponent('expandlessicon'),
  expandmoreicon: resolveComponent('expandmoreicon'),
  fullscreenexiticon: resolveComponent('fullscreenexiticon'),
  fullscreenicon: resolveComponent('fullscreenicon'),
  playarrowicon: resolveComponent('playarrowicon'),
  stopicon: resolveComponent('stopicon'),
  volumeofficon: resolveComponent('volumeofficon'),
  volumeupicon: resolveComponent('volumeupicon'),
};

const props = defineProps({
  active: {
    type: Boolean
  },
  defaultIcon: {
    type: String
  },
  activeIcon: {
    type: String
  }
})

const activeIconResolved = icons[props.activeIcon];
const defaultIconResolved = icons[props.defaultIcon];

defineEmits([ 'click' ]);
</script>

<template lang="pug">
.controller-button--container(@click="$emit('click')")
  .controller-button.button.transparent.circled
    component.icon(
      :is="props.active ? activeIconResolved : defaultIconResolved",
    )
</template>

<style lang="scss" scoped src="@/assets/styles/components/controllerbutton.scss"></style>