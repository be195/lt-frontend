<script lang="ts" setup>
const props = defineProps({
  view: {
    type: Boolean
  },
  paused: {
    type: Boolean
  },
  muted: {
    type: Boolean
  },
  volume: {
    type: Number
  },
  chat: {
    type: Boolean
  },
  fullscreen: {
    type: Boolean
  }
})

defineEmits([
  'togglePlay',
  'toggleMute',
  'slider',
  'toggleChat',
  'toggleFullscreen'
]);
</script>

<template lang="pug">
div(:class="{ controls: true, view: props.view }")
  //
    why do i get weirded out by this? this was done intentionally
    just so chat would have been in the same place as it was
  .controls--inner
    .side.left
      .side--inner
        controllerbutton(
          :active="props.paused",
          default-icon="stopicon",
          active-icon="playarrowicon"
          @click="$emit('togglePlay')"
        )
        controllerbutton(
          :active="props.muted",
          default-icon="volumeupicon",
          active-icon="volumeofficon"
          @click="$emit('toggleMute')"
        )
        input.slider(
          type="range",
          min="0",
          max="100",
          :value="muted ? 0 : volume * 100",
          @change="(v) => $emit('slider', v)",
          @input="(v) => $emit('slider', v)"
        )
        controllerbutton(
          :active="props.chat",
          default-icon="chatbubbleicon",
          active-icon="crossicon"
          @click="$emit('toggleChat')"
        )
    .side.right
      .side--inner
        controllerbutton(
          :active="props.fullscreen",
          default-icon="fullscreenicon",
          active-icon="fullscreenexiticon"
          @click="$emit('toggleFullscreen')"
        )
</template>

<style lang="scss" src="@/assets/styles/components/controller.scss" scoped></style>