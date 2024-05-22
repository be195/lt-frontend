<template lang="pug">
.root
  NuxtLoadingIndicator(color="var(--primary-base)")
  NuxtLayout
    NuxtPage
</template>

<style>
.root, div[data-v-app], body, html {
  height: 100%;
  overflow: auto;
}
</style>

<style src="assets/css/fonts.css"></style>
<style lang="scss" src="@/assets/styles/style.scss"></style>
<style lang="scss" src="@/assets/styles/transitions/fade.scss"></style>
<style lang="scss" src="@/assets/styles/transitions/controller-button.scss"></style>
<style lang="scss" src="@/assets/styles/plugins/vfm.scss"></style>