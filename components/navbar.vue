<script setup lang="ts">
import { i18n } from '~~/utils/i18n';

const collapsed = useState('drawerCollapsed', () => true);

function hamburgerClick() {
  collapsed.value = !collapsed.value;
}

const userInfo = useSelfInfo();

async function logout() {
  await $fetch('/sst/logout');
  await navigateTo('/login');
}
</script>

<template lang="pug">
.navbar
  .navbar--inner
    .left
      div(
        :class="{ button: true, circled: true, hamburger: true, transparent: true, open: !collapsed }",
        @click="hamburgerClick",
        tabindex="0"
      )
        hamburgericon.icon
      span
        logo
    .right
      span
        skeletonbox(v-if="userInfo.pending", width="8ch")
        template(v-else) {{ userInfo.login }}
      .button.circled.transparent(@click="logout")
        exiticon.icon
</template>

<style lang="scss" scoped src="@/assets/styles/components/navbar.scss"></style>