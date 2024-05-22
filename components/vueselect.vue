<script lang="ts" setup>
const props = defineProps({
  elevated: {
    type: Boolean,
    default: false
  },
  options: {
    type: Object
  },
  allowNone: {
    type: Boolean
  },
  label: {
    type: String
  },
  name: {
    type: String,
    default: 'select-menu'
  },
  value: {
    type: String
  },
  loading: {
    type: Boolean,
    default: false
  },
  class: {
    type: String
  }
});

const givenClass = useClass(props.class);

const emit = defineEmits([ 'change' ]);

let selected = ref(props.value ? props.options[props.value] : null);
let open = ref(false);

watch(() => props.value, (value) =>
  selected = ref(props.value ? props.options[props.value] : null)
);

function onSelectOpen() {
  open.value = true;
}

function onSelected(key) {
  emit('change', key);
  selected.value = key === false ? null : props.options[key];
  open.value = false;
}
</script>

<template lang="pug">
div(:class="Object.assign({ select: true, open }, givenClass)")
  forminputtext(
    type="text",
    :class="{ elevated: props.elevated }",
    :label="label",
    :name="name",
    :value="selected",
    :disable-focus-blur="true",
    :focused="selected !== null",
    :readonly="true",
    :loading="props.loading",
    @focus="!props.loading && (open = true)",
    @blur="open = false"
  )
  chevrondownicon.chevron
  ul.select--items(v-if="open")
    li(v-if="props.allowNone", @mousedown="onSelected(false)") None
    li(v-for="(option, i) of props.options", @mousedown="onSelected(i)") {{ option }}
</template>

<style lang="scss" scoped src="@/assets/styles/components/vueselect.scss"></style>