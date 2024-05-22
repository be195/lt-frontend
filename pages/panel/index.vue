<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { $showToast } = useNuxtApp();
const { t } = useI18n();

definePageMeta({
  layout: 'panel'
});

useHead({
  title: t('overview')
});

const exclamationIcon = resolveComponent('exclamationicon');

const { pending, data: streams } = useLazyFetch('/api/web/streamlist?getstatus', {
  initialCache: false
});

const empty = ref(false);
const online = ref([]);
const offline = ref([]);

function sort(streams: StreamListInfo[]) {
  const isEmpty = empty.value = Object.entries(streams).length === 0;
  if (isEmpty) return;
  for (const stream of streams)
    switch (stream.status) {
      case 'offline': {
        unref(offline).push(stream);
      } break;
      case 'online': {
        unref(online).push(stream);
      } break;
      default:
        console.log('Unknown status', stream);
    }
}

let pendingNew = ref(false);
async function createNew() {
  if (unref(pendingNew)) return;
  pendingNew.value = true;
  try {
    const data: any = await $fetch('/api/web/streaminfo', {
      method: 'POST',
    });

    await navigateTo('/panel/stream/' + data.id);
  } catch (err) {
    $showToast('error', t('failed-new-stream'), { icon: exclamationIcon })
    pendingNew.value = false;
    console.error(err);
  }
}

watch(streams, sort);
</script>

<template lang="pug">
.page
  .stream-container
    vtitle(:rich="true")
      | {{ $t('overview') }}
      template(#icon)
        dashboardicon.icon
      template(#right)
        a.button.circled.primary(@click="createNew")
            plusicon.icon
    grid
      elevatedcontainer(v-for="i in 3")
        vtitle {{ $t('card-' + i + '-title') }}
        span {{ $t('card-' + i + '-desc') }}
  .stream-container(v-if="!empty && (pending || online.length !== 0)")
    vtitle {{ $t('online-streams') }}
    grid(v-if="!pending")
      NuxtLink(v-for="stream in online", :to="'/panel/stream/' + stream.id")
        panelstreamtile(:title="stream.name", :online="true")
    grid(v-else)
      panelstreamtile(v-for="i in 3", :loading="true")

  .stream-container(v-if="!empty && (pending || offline.length !== 0)")
    vtitle {{ $t('offline-streams') }}
    grid(v-if="!pending")
      NuxtLink(v-for="stream in offline", :to="'/panel/stream/' + stream.id")
        panelstreamtile(:title="stream.name", :online="false")
    grid(v-else)
      panelstreamtile(v-for="i in 3", :loading="true")
</template>

<style lang="scss" scoped src="@/assets/styles/pages/panel/index.scss"></style>