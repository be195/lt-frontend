<template lang="pug">
.t-container
  | {{ $t('unsaved-changes') }}
  .buttons
    a.button.secondary(@click="$emit('reset')") {{ $t('reset') }}
    a.button(@click="$emit('save')") {{ $t('save-changes') }}
</template>

<style lang="scss" scoped src="@/assets/styles/components/saveresettoast.scss"></style>