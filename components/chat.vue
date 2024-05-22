<script lang="ts" setup>
import { StreamStatsOpCodes } from '@/constants';

const props = defineProps({
  id: {
    type: String
  },
  view: {
    type: Boolean
  },
  noauth: {
    type: Boolean,
    default: false
  },
  viewInputs: {
    type: Boolean
  }
})

const viewRegardless = ref(false);
let viewRegardlessTimeout: any;

const MAXIMUM = 512;
const messageObjects = ref([]);
const messages = ref(null);

const {
  safeClose,
  websocketContainer: streamStats
} = useLazyStreamStats(props.id, props.noauth);

onUnmounted(() =>
  safeClose()
);

function forceView(bad = false) {
  viewRegardless.value = true;
  if (viewRegardlessTimeout)
    clearTimeout(viewRegardlessTimeout);
  viewRegardlessTimeout = setTimeout(() => viewRegardless.value = false, 3000);
  if (!bad)
    nextTick(() => messages.value.scrollTop = messages.value.scrollHeight - messages.value.clientHeight);
}

function onMessage(message: any) {
  forceView();
  messageObjects.value.push(message);
  while (unref(messageObjects).length > MAXIMUM)
    messageObjects.value.shift();
}

watch(
  () => props.view,
  () => props.view && nextTick(() => (messages.value.scrollTop = messages.value.scrollHeight))
);

function onStreamStatsMessage({ data }: MessageEvent<any>) {
  const message = JSON.parse(data);
  switch (message.op) {
    case StreamStatsOpCodes.CHAT_MESSAGE:
      onMessage(message);
      break;
  }
}

function addStreamStatsListeners(streamStats) {
  streamStats.addEventListener('message', onStreamStatsMessage)
  streamStats.addEventListener(
    'close',
    () =>
      streamStats.removeEventListener('message', onStreamStatsMessage),
    { once: true }
  );
}

const streamStatusUnref = unref(streamStats);
if (streamStatusUnref)
  addStreamStatsListeners(streamStatusUnref);

watch(streamStats, addStreamStatsListeners);

const { info, nickname, postMessage } = useChatClient(props.id);

const disabled = ref(true);
const placeholder = ref(null);
const displayForm = ref(false);
placeholder.value = 'loading';

watch(info, (info: ChatInfoResponse) => {
  if (info.canchat) {
    if (!info.loggedin) {
      displayForm.value = true;
      placeholder.value = 'chat-enter-nickname';
    } else {
      nickname.value = info.loggedin;
      disabled.value = false;
      placeholder.value = null;
    }
  } else
    placeholder.value = info.shouldlogin ? 'chat-login-required' : 'chat-disabled';
});

function onFormKeyPress(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    e.preventDefault();

    nickname.value = (e.target as HTMLFormElement).value;
    displayForm.value = false;
    disabled.value = false;
    placeholder.value = null;
  }
}
</script>

<!--
  // TODO: improve chat further
  // FIXME: bug that makes text disappear with the chat
-->
<template lang="pug">
.chat-container
  Transition(name="fade")
    .chat-container--inner(v-show="props.view || viewRegardless")
      .messages
        .messages--inner(@scroll="() => forceView(true)", ref="messages")
          .message(v-for="message of messageObjects")
            div(:class="{ nick: true, anonymous: message.anontag !== undefined }")
              | {{ message.nick }}
              .anontag(v-if="message.anontag") {{ message.anontag }}
            .content {{ message.chatmsg }}
        form.form(v-if="props.viewInputs && displayForm")
          span {{ $t('chat-enter-nickname') }}
          forminputtext(
            type="text",
            :label="$t('chat-nickname')",
            @keypress="onFormKeyPress",
            @input="forceView"
          )
      chatinput(
        v-if="props.viewInputs",
        :placeholder="placeholder",
        :disabled="disabled",
        @send="message => postMessage(message)",
        @input="forceView"
      )
</template>

<style lang="scss" scoped src="@/assets/styles/components/chat.scss"></style>