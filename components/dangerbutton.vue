<script lang="ts" setup>
const icons = {
  clipboardcopyicon: resolveComponent('clipboardcopyicon'),
  crossicon: resolveComponent('crossicon'),
  exiticon: resolveComponent('exiticon'),
  linkicon: resolveComponent('linkicon'),
  reseticon: resolveComponent('reseticon'),
  usericon: resolveComponent('usericon'),
};

const props = defineProps({
  buttonText: {
    type: String
  },
  modalText: {
    type: String
  },
  textinpText: {
    type: String
  },
  icon: {
    type: String
  },
  primary: {
    type: Boolean
  },
  textinp: {
    type: Boolean
  },
  notdanger: {
    type: Boolean
  }
});

const showModal = ref(false);
const $emit = defineEmits([ 'click' ]);

const textInput = ref('');

function modalAccept() {
  showModal.value = false;
  $emit('click', textInput.value);
}
</script>

<!-- TODO: not use dangerbutton for everything, pls -->
<template lang="pug">
.danger-button
  vue-final-modal(v-model="showModal", @cancel="showModal = false")
    .modal__content
      vtitle {{ $t(props.buttonText) }}
      span {{ $t(props.modalText) }}
      forminputtext(
        v-if="props.textinp",
        :disabled="disable",
        type="text",
        name=textinpText,
        @input="({ target }) => (textInput = target.value)"
      )
    .modal__footer
      a.button(@click="showModal = false") {{ $t('no') }}
      a(:class="{ button: true, primary: notdanger, danger: !notdanger }", @click="modalAccept") {{ $t('yes') }}
  a(:class="{ button: true, danger: !notdanger, primary: props.primary }", @click="showModal = true")
    component.icon(:is="icons[props.icon]")
    | {{ $t(props.buttonText) }}
</template>

<style lang="scss" scoped src="@/assets/styles/components/dangerbutton.scss"></style>