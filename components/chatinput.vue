<script lang="ts" setup>
const focus = ref(false);
const input = ref('');
const height = ref(0);

const props = defineProps({
  placeholder: { type: String },
  disabled: { type: Boolean }
});

const emit = defineEmits([ 'send' ]);

function onFocus(e: FocusEvent) {
  focus.value = true;
}

function onBlur(e: FocusEvent) {
  if ((e.target as HTMLInputElement).value.length === 0)
    focus.value = false;
}

function onKeyPress(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault();

    emit('send', input.value);
    input.value = '';
    height.value = 0;
  }
}

function onInput(e: InputEvent) {
  const target = e.target as HTMLFormElement;
  input.value = target.value;
  height.value = 0;
  nextTick(() => height.value = target.scrollHeight);
}
</script>

<template lang="pug">
div(:class="{ 'chat-input': true, focus }")
  textarea(
    :disabled="props.disabled"
    :placeholder="$t(props.placeholder || 'chat-placeholder')",
    :style="{ height: height + 'px' }"
    @focus="onFocus",
    @blur="onBlur",
    @keypress="onKeyPress",
    @input="onInput",
    :value="input"
  )
  .lines
    .lines--inner
      .blur-line
      .focus-line
</template>

<style lang="scss" scoped src="@/assets/styles/components/chatinput.scss"></style>