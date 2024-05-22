<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { StreamStatsOpCodes } from '@/constants';

const route = useRoute();
const { id } = route.params;

const { safeClose, websocketContainer: streamStats } = useLazyStreamStats(id as string);

const title = ref('Live Tucker Reaction');
useHead({ title });

const { t } = useI18n();

let online = true;

function onStreamStatsMessage(this: WebSocket, { data }: MessageEvent<any>) {
  const message = JSON.parse(data);
  switch (message.op) {
    case StreamStatsOpCodes.STREAM_STATUS: {
      if (!message.online)
        title.value = 'Live Tucker Reaction';
      online = message.online;
    }
    case StreamStatsOpCodes.WATCHERS_UPDATE: {
      if (online)
        title.value = t('viewers', { watchers: message.watchers });
    } break;
    case StreamStatsOpCodes.STREAM_STATS: {
      if (message.watchers)
        title.value = t('viewers', { watchers: message.watchers });
    } break;
  }
}

onMounted(() => {
  document.body.style.overflow = 'hidden';
});

onUnmounted(() =>
  safeClose()
);

function addStreamStatsListeners(streamStats) {
  streamStats.addEventListener('message', onStreamStatsMessage)
  streamStats.addEventListener(
    'close',
    () =>
      streamStats.removeEventListener('message', onStreamStatsMessage),
    { once: true }
  );
}

if (streamStats.value)
  addStreamStatsListeners(streamStats.value);

watch(streamStats, addStreamStatsListeners);
</script>

<template lang="pug">
.container
  streamviewer(:id="id")
</template>

<style lang="scss" src="@/assets/styles/pages/watch.scss" scoped></style>