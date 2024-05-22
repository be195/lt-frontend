<script lang="ts" setup>
const props = defineProps({
  online: {
    type: Boolean
  },
  viewers: {
    type: Number
  }
});
</script>

<template lang="pug">
span.online
  span {{ $t(props.online ? (props.viewers ? 'viewers' : 'online') : 'offline', { watchers: props.viewers }) }}
  span(:class="{ indicator: true, online: props.online }") &bull;
</template>

<style lang="scss" scoped src="@/assets/styles/components/onlineindicator.scss"></style>