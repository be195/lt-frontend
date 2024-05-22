<script lang="ts" setup>
import { filename } from 'pathe/utils';
import { StreamStatsOpCodes } from '@/constants';

const props = defineProps({
  id: {
    type: String
  }
});

const {
  safeClose,
  showErrorBanner: showStreamStatsError,
  errorString: streamStatsError,
  time: streamStatsCountdownTime,
  websocketContainer: streamStats
} = useLazyStreamStats(props.id);
let peerConnection = ref(null);

const video = ref(null);

function setupPeerConnection(peertoken: string) {
  peerConnection = useLazyPeerConnection(peertoken);

  const peerConUnref = unref(peerConnection);
  peerConUnref.addEventListener('track', onPeerConnectionTrack);
}

function onPeerConnectionTrack({ track, streams }: RTCTrackEvent) {
  if (track.kind === 'video')
    unref(video).srcObject = streams[0];
}

function onStreamStatsMessage({ data }: MessageEvent<any>) {
  const message = JSON.parse(data);
  switch (message.op) {
    case StreamStatsOpCodes.STREAM_STATS:
    case StreamStatsOpCodes.STREAM_STATUS: {
      if (!message.online) {
        showStreamStatsError.value = true;
        streamStatsError.value = 'stream-unavailable';

        const peerConnUnref = unref(peerConnection);
        if (peerConnUnref && peerConnUnref.signalingState !== 'closed')
          peerConnUnref.close();
      } else {
        showStreamStatsError.value = false;

        setupPeerConnection(message.peertoken);
      }
    } break;
  }
}

function addStreamStatsListeners(streamStats) {
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

let isFullscreened = ref(false);
let isPaused = ref(false);
let volume = ref(0);
let isMuted = ref(false);
watch(volume, (volume) =>
  unref(video).volume = volume
);

function clickFullscreen() {
  if (isFullscreened.value)
    document.exitFullscreen()
  else
    document.documentElement.requestFullscreen();
}

function mute(unmute: boolean = isMuted.value) {
  const videoUnref = unref(video);
  if (unmute) {
    videoUnref.muted = false;
    isMuted.value = false;
  } else {
    videoUnref.muted = true;
    isMuted.value = true;

    if (unref(volume) === 0)
      volume.value = 0.75;
  }
}

function changeVolume(e: InputEvent) {
  const { value } = e.target as HTMLFormElement;
  volume.value = value / 100;

  mute(value != 0);
}

const glob = import.meta.glob('~/assets/svgs/*.svg', { eager: true });
const images = Object.fromEntries(
  Object.entries(glob).map(([key, value]) => [filename(key), (value as any).default])
);

const playarrow = resolveComponent('playarrowicon');
const stop = resolveComponent('stopicon');

const showIndicator = ref(false);
const image = shallowRef(playarrow);

function togglePlay() {
  const videoUnref = unref(video);
  if (unref(isPaused)) {
    videoUnref.play();
    image.value = playarrow;
  } else {
    videoUnref.pause();
    image.value = stop;
  }

  showIndicator.value = true;
  nextTick(() => showIndicator.value = false);
}

function keyDown(e: KeyboardEvent) {
  if ((e.target as any).matches('textarea') || e.repeat) return;
  switch (e.key) {
    case ' ':
      togglePlay();
    break;
    case 'm':
      mute();
    break;
  }
}

onMounted(() => {
  isFullscreened.value = document.fullscreenElement !== null;

  const videoUnref = unref(video);
  isPaused.value = videoUnref.paused;
  volume.value = videoUnref.volume;
  isMuted.value = videoUnref.muted;

  document.addEventListener('fullscreenchange', (e: Event) =>
    isFullscreened.value = document.fullscreenElement !== null
  );
});

onUnmounted(() =>
  safeClose()
);

let isMobile = false;
let viewTimeout: any;

const chatOpen = ref(false);

const view = ref(false);

onMounted(() => {
  isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  view.value = isMobile;
});

function onMouseAction() {
  if (isMobile) return;
  view.value = true;
  if (viewTimeout)
    clearTimeout(viewTimeout);
    viewTimeout = setTimeout(() => view.value = false, 3000);
}
</script>

<template lang="pug">
.stream-viewer(
  @keydown="keyDown",
)
  div(
    :class="{ 'stream-viewer--inner': true, cursor: view }",
    @mousemove="onMouseAction",
    @click="onMouseAction",
    tabindex="-1"
  )
    video(
      autoplay,
      muted,
      ref="video",
      :class="{ error: showStreamStatsError }"

      @play="isPaused = false",
      @pause="isPaused = true"
    )
    .indicator
      Transition(name="zoom-in")
        component(v-if="showIndicator", :is="image")
    .controls--container
      chat(:id="id", :view="view", :view-inputs="chatOpen")
      controller(
        :view="view",
        :paused="isPaused",
        :muted="isMuted",
        :volume="volume",
        :chat="chatOpen",
        :fullscreen="isFullscreened",

        @toggle-play="togglePlay",
        @toggle-mute="mute",
        @slider="changeVolume",
        @toggle-chat="chatOpen = !chatOpen",
        @toggle-fullscreen="clickFullscreen"
      )
    Transition(name="fade")
      streamviewererrorbanner(
        v-if="showStreamStatsError",
        :error="streamStatsError",
        :argument="streamStatsCountdownTime.toString()"
      )
</template>

<style lang="scss" scoped src="@/assets/styles/components/streamviewer.scss"></style>
<style lang="scss" src="@/assets/styles/transitions/fade.scss"></style>
<style lang="scss" src="@/assets/styles/transitions/zoom-in.scss"></style>
