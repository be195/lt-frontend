<script lang="ts" setup>
import { LocalStorageKeys } from '@/constants';
import { NAMES } from '@/assets/locales/';

const props = defineProps({
  elevated: {
    type: Boolean
  },
  class: {
    type: String
  }
});

const save = (i: string) => localStorage.setItem(LocalStorageKeys.LANGUAGE, i);
</script>

<template lang="pug">
vueselect(
  name="select-language",
  :class="props.class",
  :elevated="props.elevated",
  :label="$t('select-language')",
  :options="NAMES",
  :value="$i18n.locale",
  @change="value => ($i18n.locale = value, save(value))"
)
</template>