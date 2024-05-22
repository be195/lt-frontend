import { LocalStorageKeys } from '@/constants';
import '@/assets/styles/accessibility.scss';

export default defineNuxtPlugin(nuxtApp => {
  const reducedMotion = localStorage.getItem(LocalStorageKeys.REDUCED_MOTION);
  if (reducedMotion === 'true')
    document.documentElement.classList.add('reduced-motion');
});