<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { LocalStorageKeys } from '@/constants';

const showModal = ref(false);
const showSuccess = ref(false);

definePageMeta({
  layout: 'panel'
});

const error = ref(null);

const { $showToast } = useNuxtApp();
const { t } = useI18n();

const icon = resolveComponent('checkcircledicon');

const disable = ref(false);
async function onSubmit(e: SubmitEvent) {
  if (unref(disable)) return;
  disable.value = true;

  const form = e.target as HTMLFormElement;
  const data = new FormData(form);

  if (data.get('new') !== data.get('rep')) {
    error.value = 'pass-match-error';
    disable.value = false;
    return;
  }

  let value: { success: boolean };
  try {
    value = await $fetch('/userchangepasswd?json=true', {
      method: 'POST',
      body: data
    });
  } catch (err) {
    error.value = 'pass-fetch-error';
    disable.value = false;
    return;
  }

  if (!value.success)
    error.value = 'pass-error'
  else {
    showModal.value = false;
    $showToast('success', t('pass-changed'), { icon });
  }

  disable.value = false;
}

let lock = false;
async function logOut() {
  if (lock) return;
  lock = true;

  await $fetch('/userclearsessions?json=true', {
    method: 'POST',
  });
  $showToast('success', t('logged-out-sess'), { icon });

  lock = false;
}

const userInfo = useSelfInfo();
const motion = ref<boolean>(document.documentElement.classList.contains('reduced-motion'));

watch(motion, (motion) => {
  if (motion === undefined) return;
  const classList = document.documentElement.classList;

  if (motion)
    classList.add('reduced-motion')
  else
    classList.remove('reduced-motion');

  localStorage.setItem(LocalStorageKeys.REDUCED_MOTION, motion.toString());
});
</script>

<template lang="pug">
.page
  vtitle(:rich="true")
    | {{ $t('settings') }}
    template(#icon)
      gearicon.icon

  grid
    .column
      elevatedcontainer
        span.minititle {{ $t('authentication') }}
        vue-final-modal(v-model="showModal")
          form.form(@submit.prevent="onSubmit")
            .modal__content
              .error(v-if="error") {{ $t(error) }}
              vtitle {{ $t('change-pass') }}
              forminputtext(
                :label="$t('current-pass')",
                :disabled="disable",
                type="password",
                name="old",
                :focus-lock="error === null",
                @input="error = null",
              )
              forminputtext(
                :label="$t('new-pass')",
                :disabled="disable",
                type="password",
                name="new",
                :focus-lock="error === null",
                @input="error = null"
              )
              forminputtext(
                :label="$t('new-pass2')",
                :disabled="disable",
                type="password",
                name="rep",
                :focus-lock="error === null",
                @input="error = null"
              )
            .modal__footer
              a.button.secondary(@click="showModal = false") {{ $t('cancel') }}
              input.input.button.primary(type="submit", :disabled="disable", :value="$t('confirm')")
        a.button.primary(@click="() => showModal = true") {{ $t('change-pass') }}
      elevatedcontainer
        span.minititle {{ $t('visual-aids') }}
        languageselect.item(:elevated="true")
        slider#motion.item(v-model="motion")
          | {{ $t('reduce-motion') }}
          span {{ $t('reduce-motion-summary') }}

    .column
      elevatedcontainer
        span.minititle {{ $t('sessions') }}
        span {{ $t('current-sessions', { sessions: userInfo.sessioncount }) }}
        dangerbutton(
          @click="logOut",
          icon="reseticon",
          button-text="logout-sess",
          modal-text="ays-logout-sess"
        )
      elevatedcontainer
        span.minititle Admin Control
        a.button.circled(href="/admin", target="_blank")
          gearicon.icon
</template>

<style lang="scss" scoped src="@/assets/styles/pages/panel/user.scss"></style>