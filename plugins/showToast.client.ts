import { defineNuxtPlugin } from '#app';
import Toast, { POSITION, useToast } from 'vue-toastification';
import { ToastContent, ToastID, ToastOptions } from 'vue-toastification/dist/types/types';

import '@/assets/styles/plugins/vue-toastification.scss';

const toast = useToast();

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(Toast, {
    position: POSITION.BOTTOM_RIGHT,
    shareAppContext: true
  });
  nuxtApp.provide(
    'showToast',
    (type: 'warning' | 'success' | 'info' | 'error', msg: ToastContent, options: ToastOptions) =>
      toast[type](msg, Object.assign({ type, timeout: 5000, }, options))
  );
  nuxtApp.provide(
    'dismissToast',
    (id: ToastID) =>
      toast.dismiss(id)
  );
});