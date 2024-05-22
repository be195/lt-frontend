<script setup lang="ts">
const icons = {
  dashboardicon: resolveComponent('dashboardicon'),
  gearicon: resolveComponent('gearicon'),
  homeicon: resolveComponent('homeicon'),
};

const props = defineProps({
  active: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String
  },
  to: {
    type: String
  },
});

const route = useRoute();

const emit = defineEmits([ 'click' ]);
const iconResolved = computed(() => icons[props.icon]);
const collapsed = useState('drawerCollapsed', () => true);

const classRef = ref({ link: true, active: props.active, collapsed, button: true, transparent: true });
watch(collapsed, (val) => classRef.value.collapsed = val);
</script>

<template lang="pug">
NuxtLink(:to="props.to", :class="classRef", @click="emit('click')")
  component.icon(:is="iconResolved")
  span
    slot
</template>

<style lang="scss" scoped src="@/assets/styles/components/drawerlink.scss"></style>