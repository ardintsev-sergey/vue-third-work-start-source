import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { clickOutside } from './common/directives';
import { useAuthStore } from '@/stores/auth';
import { getToken, removeToken } from '@/services/token-manager';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.directive('click-outside', clickOutside);

app.mount('#app');

// Проверяем если пользователь уже вошел в систему
async function restoreSession() {
  const token = getToken();
  if (!token) {
    return;
  }

  try {
    const authStore = useAuthStore();
    await authStore.getMe();
    await router.push('/');
  } catch (e) {
    removeToken();
    console.log(e);
  }
}

restoreSession();
