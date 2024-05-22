<script setup lang="ts">
const collapsed = useState('drawerCollapsed', () => true);
const drawer = ref(null);
const click = () => (collapsed.value = true);
</script>

<template lang="pug">
div(:class="{ drawer: true, collapsed }", ref="drawer", @blur="!collapsed && (collapsed = !collapsed)")
  .placeholder
  .drawer--container
    .drawer--container--inner
      div
        drawerlink(to="/panel/", icon="homeicon", @click="click") {{ $t('overview') }}
        drawerlink(to="/panel/user", icon="gearicon", @click="click") {{ $t('settings') }}
</template>

<style lang="scss" scoped src="@/assets/styles/components/drawer.scss"></style>