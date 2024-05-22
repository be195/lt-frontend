import { createI18n } from 'vue-i18n';

import { LocalStorageKeys } from '@/constants';

import en from '@/assets/locales/en.json';
import ru from '@/assets/locales/ru.json';

const instance = createI18n({
  legacy: false,
  globalInjection: true,
  locale: localStorage.getItem(LocalStorageKeys.LANGUAGE) || 'en',
  messages: {
    en,
    ru,
  }
});

export default instance;
export const i18n = instance.global;