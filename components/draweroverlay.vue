<script setup lang="ts">
const collapsed = useState('drawerCollapsed', () => true);
</script>

<template lang="pug">
Transition(name="fade")
  .drawer--overlay(@click="collapsed = !collapsed", v-if="!collapsed")
</template>

<style lang="scss" scoped>
.drawer--overlay {
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2;
}
</style>