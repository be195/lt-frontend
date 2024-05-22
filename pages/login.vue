<script lang="ts" setup>
definePageMeta({ layout: false });
const showError = ref(false);
const error = ref([]);
const disable = ref(false);

// this is ugly, but we want to keep the login
const login = ref('');

async function onSubmit(e: SubmitEvent) {
  if (unref(disable)) return;
  disable.value = true;

  const form = e.target as HTMLFormElement;

  let value: { success: boolean, msg: string[] };
  try {
    value = await $fetch('/sst/loginuser', {
      method: 'POST',
      body: new FormData(form)
    });
  } catch (err) {
    error.value = [ 'login-fetch-error' ];
    disable.value = false;
    return;
  }

  disable.value = false;
  if (!value.success) {
    form.querySelectorAll('input[type="password"]').forEach(
      x => (x as HTMLInputElement).value = ''
    );
    showError.value = true;
    error.value = value.msg;
  } else
    console.log(await navigateTo('/panel/'));
}
</script>

<template lang="pug">
.container
  .container--item
    form.form(@submit.prevent="onSubmit")
      .error(v-if="showError && error && error.length > 0") {{ $t(error[0], { argument: error[1] }) }}
      h1.title {{ $t('login-title') }}
      forminputtext(
        :label="$t('username')",
        :disabled="disable",
        type="text",
        name="uname",
        :value="login",
        @input="({ target }) => (login = target.value, showError = false)"
      )
      forminputtext(
        :label="$t('password')",
        :disabled="disable",
        type="password",
        name="passwd",
        :focus-lock="!showError",
        @input="() => showError = false"
      )
      input.input.button(type="submit", :disabled="disable", :value="$t('login-button')")
  .container--item
    languageselect
</template>

<style lang="scss" src="@/assets/styles/pages/login.scss" scoped></style>