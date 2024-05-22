<script lang="ts" setup>
const props = defineProps({
  type: {
    type: String
  },
  name: {
    type: String
  },
  label: {
    type: String
  },
  value: {
    type: String
  },
  readonly: {
    type: Boolean
  },
  disableFocusBlur: {
    type: Boolean
  },
  focused: {
    type: Boolean
  },
  focusLock: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean
  },
  loading: {
    type: Boolean
  },
  elevated: {
    type: Boolean
  },
  class: {
    type: String
  }
});

const givenClass = useClass(props.class);

const emit = defineEmits([ 'focus', 'blur', 'input', 'keypress' ]);

let focus = ref(!!props.value);
function onFocus(e: FocusEvent) {
  emit('focus');
  if (!props.disableFocusBlur)
    focus.value = true;
}

function onBlur(e: FocusEvent) {
  emit('blur');
  if (!props.disableFocusBlur && (e.target as HTMLInputElement).value.length === 0)
    focus.value = false;
}

function onInput(e: InputEvent) {
  emit('input', e);
}

const altered = () =>
  focus.value = (unref(focus) || props.focused) && props.focusLock

watch(() => props.focused, altered);
watch(() => props.focusLock, altered);
</script>

<template lang="pug">
div(:class="Object.assign({ 'form-item': true, elevated: props.elevated, focus }, givenClass)")
  template(v-if="loading")
    skeletonbox.input(width="100%", height="auto")
      | &nbsp;
  template(v-else)
    label {{ label }}
    input.input(
      :type="type",
      :name="name",
      :value="value",
      :readonly="readonly",
      :disabled="disabled",
      @keypress="e => $emit('keypress', e)"
      @focus="onFocus",
      @blur="onBlur",
      @input="onInput"
    )
</template>

<style lang="scss" scoped src="@/assets/styles/components/forminputtext.scss"></style>