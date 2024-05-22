<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Saveresettoast } from '#components';
import { StreamStatsOpCodes } from '@/constants';

const { t } = useI18n();

definePageMeta({
  layout: 'panel'
});

const chatmodeSelectionOptions = {
  pub: t('public'),
  reg: t('registered'),
  disable: t('private')
};
const privacySelectionOptions = {
  false: t('public'),
  true: t('private')
};

const protocolSelectOptions = {
  rtmp: 'rtmp',
  whip: 'whip'
};

const clipboardCopyIcon = resolveComponent('clipboardcopyicon');
const exclamationIcon = resolveComponent('exclamationicon');
const questionMarkIcon = resolveComponent('questionmarkicon');

const route = useRoute();
const { $showToast, $dismissToast } = useNuxtApp();

const { id } = route.params;

const { pending, data, refresh } = useLazyFetch('/api/web/streaminfo/' + id, {
  initialCache: false
});
const link = ref('');

onMounted(() => {
  initializeStreamStats(id as string);
  link.value = location.origin + '/watch/'
});

let titleOriginal = '';
const titleCurrent = ref('');

let privacyOriginal = '';
const privacyCurrent = ref('');

let chatPrivacyOriginal = '';
const chatPrivacyCurrent = ref('');

const protocolSelected = ref('');
const serverSelectedURL = ref('');
const serverSelected = ref('');
const whipurl = ref('')

whipurl.value = location.origin + '/whip/'

const connected = ref(false);
const online = ref(false);
const viewers = ref(0);

const title = ref(t('loading'));
useHead({ title });

function onStreamStatsMessage(this: WebSocket, { data }: MessageEvent<any>) {
  const message = JSON.parse(data);
  switch (message.op) {
    case StreamStatsOpCodes.STREAM_STATUS: {
      online.value = message.online;
    } break;
    case StreamStatsOpCodes.WATCHERS_UPDATE: {
      if (unref(online))
        viewers.value = message.watchers;
    } break;
    case StreamStatsOpCodes.STREAM_STATS: {
      online.value = message.online;
      if (message.watchers)
        viewers.value = message.watchers;
    } break;
  }
}

let toast = null;

watch(data, ({ name, privacy, chatmode, wurl }) => {
  link.value += wurl;
  titleOriginal = titleCurrent.value = name;
  title.value = name;

  privacyOriginal = privacyCurrent.value = privacy.toString();
  chatPrivacyOriginal = chatPrivacyCurrent.value = chatmode;
});

function initializeStreamStats(wurl: string) {
  const {
    safeClose,
    websocketContainer: streamStats,
  } = useLazyStreamStats(wurl, false, true);

  function addStreamStatsListeners(streamStats) {
    connected.value = true;
    streamStats.addEventListener('message', onStreamStatsMessage);
    streamStats.addEventListener(
      'close',
      () =>
        streamStats.removeEventListener('message', onStreamStatsMessage),
      { once: true }
    );
  }

  const streamStatsUnref = unref(streamStats);
  if (streamStatsUnref)
    addStreamStatsListeners(streamStatsUnref);

  watch(streamStats, addStreamStatsListeners);

  onUnmounted(() =>
    safeClose()
  );
}

function showSaveResetToast() {
  if (toast !== null) return;
  toast = $showToast('info', {
    component: Saveresettoast,
    listeners: {
      reset: resetInputs,
      save: saveInputs
    },
  }, {
    timeout: false,
    closeButton: false,
    onClose: resetInputs,
    icon: questionMarkIcon,
  });
}

function closeSaveResetToast() {
  if (toast === null) return;
  $dismissToast(toast);
  toast = null;
}

function watchForSettings() {
  if (titleOriginal !== unref(titleCurrent) ||
    privacyOriginal !== unref(privacyCurrent) ||
    chatPrivacyOriginal !== unref(chatPrivacyCurrent))
    showSaveResetToast()
  else
    closeSaveResetToast()
}

onUnmounted(() => closeSaveResetToast());

watch(titleCurrent, watchForSettings);
watch(privacyCurrent, watchForSettings);
watch(chatPrivacyCurrent, watchForSettings);

const token = ref('');
const peers = ref({});

async function onStreamingReveal(force: boolean = false) {
  if (!force && unref(token).length > 0 && Object.entries(unref(peers)).length > 0) return;
  const peerlistResponse: GetPeersResponse = await $fetch('/sst/getpeers');
  const tokenResponse: GetKeyResponse = await $fetch('/sst/getkey/' + id);
  if (!peerlistResponse.success || !tokenResponse.success) return;
  token.value = tokenResponse.key;
  peers.value = peerlistResponse.peers;
}

let ignoreResetInput = true;

function resetInputs() {
  if (ignoreResetInput) {
    ignoreResetInput = false;
    return;
  }
  titleCurrent.value = titleOriginal;
  privacyCurrent.value = privacyOriginal;
  chatPrivacyCurrent.value = chatPrivacyOriginal;
}

async function saveInputs() {
  ignoreResetInput = true;
  closeSaveResetToast();

  const form = new FormData();
  form.append('name', unref(titleCurrent));
  form.append('privacy', unref(privacyCurrent) === 'true' ? '1' : '0');
  form.append('chatmode', unref(chatPrivacyCurrent));
  let result: { success: boolean };
  try {
    result = await $fetch('/api/web/streaminfo/' + id, {
      method: 'PATCH',
      body: form,
    });
  } catch (err) {
    $showToast('error', t('failed-to-update'), { icon: exclamationIcon });
    showSaveResetToast();
    console.error(err);
    ignoreResetInput = false;
    return;
  }

  if (result.success) {
    titleOriginal = unref(titleCurrent);
    privacyOriginal = unref(privacyCurrent);
    chatPrivacyOriginal = unref(chatPrivacyCurrent);
    title.value = titleCurrent.value;
    ignoreResetInput = false;
  }
}

async function copy(txt: string) {
  try {
    if (!navigator.clipboard) throw new Error();
    await navigator.clipboard.writeText(txt);
  } catch (err) {
    const tmp = document.createElement('textarea');
    tmp.style.top = '0';
    tmp.style.left = '0';
    tmp.style.position = 'fixed';
    tmp.innerText = txt;
    document.body.appendChild(tmp);

    tmp.select();
    tmp.setSelectionRange(0, txt.length);
    document.execCommand('copy');
    tmp.remove();
  }

  $showToast('info', t('copied-to-clipboard'), { icon: clipboardCopyIcon });
}

function createDataUpdateCallback(routeName: string, redirectToOverview: boolean = false) {
  const form = new FormData();
  form.append('id', id as string);

  return async () => {
    try {
      await $fetch('/sst/' + routeName, { method: 'POST', body: form });
      if (!redirectToOverview)
        await onStreamingReveal(true);
    } catch (err) {
      $showToast('error', t('failed-to-update'), { icon: exclamationIcon });
      console.error(err);
      return;
    }

    link.value = location.origin + '/watch/';

    if (redirectToOverview)
      await navigateTo('/panel/')
    else
      await refresh();
  }
}

async function setCustomURL(customURL: string) {
  const form = new FormData();
  form.append('id', id as string);
  form.append('newurl', customURL as string);

  try {
    await $fetch('/sst/resetwatch', { method: 'POST', body: form });
    await onStreamingReveal(true);
  } catch (err) {
    $showToast('error', t('failed-to-update'), { icon: exclamationIcon });
    console.error(err);
    return;
  }

  link.value = location.origin + '/watch/';
  await refresh();
}

const getNewURL = createDataUpdateCallback('resetwatch');
const resetKey = createDataUpdateCallback('resetkey');
const deleteStream = createDataUpdateCallback('destroystream', true);
</script>

<!-- TODO: something needs to be done about this -->

<template lang="pug">
div
  .panel-container()
    .left
      div
        vtitle(:rich="true")
          | {{ $t('basic-info') }}
          template(#icon)
            infocircledicon.icon
          template(#right)
            onlineindicator(v-if="connected", :online="online", :viewers="viewers")
        span {{ $t('basic-info-summary') }}
        forminputtext(
          :label="$t('name')",
          :value="titleCurrent",
          :focused="titleCurrent ? titleCurrent.length > 0 : false",
          :loading="pending",
          @input="(v) => titleCurrent = v.target.value"
        )
        .inline.mobile-margin
          .column
            vueselect(
              :label="$t('privacy')",
              :options="privacySelectionOptions",
              :value="privacyCurrent",
              :loading="pending",
              @change="(v) => privacyCurrent = v"
            )
          .column
            vueselect(
              :label="$t('chat-privacy')",
              :options="chatmodeSelectionOptions",
              :value="chatPrivacyCurrent",
              :loading="pending",
              @change="(v) => chatPrivacyCurrent = v"
            )
      div
        vtitle(:rich="true")
          | {{ $t('streaming') }}
          template(#icon)
            eyenoneicon.icon
        span {{ $t('streaming-summary') }}
        spoiler(@reveal="onStreamingReveal")
          .keyselection
            .inline.mobile-margin
              .column
                vueselect(
                  :label="$t('protocol')",
                  :options="protocolSelectOptions",
                  @change="(v) => protocolSelected = v"
                )
              .column
                vueselect(
                  :label="$t('streamserver')",
                  :options="Object.keys(peers)",
                  @change="(i) => {[serverSelected, serverSelectedURL] = Object.entries(peers)[i]}"
                )
          .keyselection
            .inline.copy
              .column.extend
                forminputtext(
                  :disabled="true",
                  :label="$t('token')",
                  :value="token",
                  :loading="pending",
                  :focused="token.length !== 0"
                )
              .column.collapse
                a.button.circled.elevated(@click="() => copy(token)")
                  clipboardcopyicon.icon
          .inline.copy(v-if="protocolSelected === 'rtmp'")
            .column.extend
              forminputtext(
                :disabled="true",
                :label="$t('streamserver-url')",
                :value="serverSelectedURL",
                :loading="pending",
                :focused="serverSelectedURL.length !== 0"
              )
            .column.collapse
              a.button.circled.elevated(@click="() => copy(serverSelectedURL)")
                clipboardcopyicon.icon
          .inline.copy(v-else-if="protocolSelected === 'whip'")
            .column.extend
              forminputtext(
                :disabled="true",
                :label="$t('streamserver-url')",
                :value="whipurl + serverSelected",
                :loading="pending",
                :focused="serverSelected.length !== 0"
              )
            .column.collapse
              a.button.circled.elevated(@click="() => copy(whipurl + serverSelected)")
                clipboardcopyicon.icon

    .right
      div
        vtitle(:rich="true")
          | URL
          template(#icon)
            linkicon.icon
        span {{ $t('url-summary') }}
        .inline.copy
          .column.extend
            forminputtext(
              :disabled="true",
              label="URL",
              :value="link",
              :loading="pending",
              :focused="link.length !== 0"
            )
          .column.collapse
            a.button.circled.elevated(@click="() => copy(link)")
              clipboardcopyicon.icon
        .urlbuttons
          .inline.mobile-margin
            .column
              dangerbutton(
                button-text="new-url",
                modal-text="ays-new-url",
                icon="linkicon",
                notdanger=true,
                @click="getNewURL"
              )
            .column.justify-right
              dangerbutton(
                button-text="new-url-custom",
                modal-text="new-url-custom-desc",
                textinp-text="new-url-text-box",
                icon="linkicon",
                textinp=true,
                notdanger=true,
                primary=true,
                @click="(custurl) => setCustomURL(custurl)"
              )
      div
        vtitle(:rich="true")
          | {{ $t ('chat') }}
          template(#icon)
            chatbubbleicon.icon
        span {{ $t('chat-summary') }}
        elevatedcontainer
          chat(v-if="!pending", :id="data.wurl", :noauth="true", :view="true", :view-inputs="true")
      .buttons
        vtitle(:rich="true")
          | {{ $t('danger-zone') }}
          template(#icon)
            exclamationicon.icon
        .buttons--inner
          dangerbutton(
            button-text="reset-key",
            modal-text="ays-reset-key",
            icon="reseticon",
            @click="resetKey"
          )
          dangerbutton(
            :secondary="true",
            button-text="delete-stream",
            modal-text="ays-delete-stream",
            icon="crossicon",
            @click="deleteStream"
          )
</template>

<style lang="scss" scoped src="@/assets/styles/pages/panel/manage.scss"></style>