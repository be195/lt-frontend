<script lang="ts" setup>
const props = defineProps({
  error: {
    type: String
  },
  argument: {
    type: String
  }
})
</script>

<template lang="pug">
.error-overlay
  .error-overlay--inner
    vtitle （；´д｀）ゞ
    span.info {{ $t(error, { seconds: argument }) }}
</template>

<style lang="scss" scoped src="@/assets/styles/components/streamviewererrorbanner.scss"></style>