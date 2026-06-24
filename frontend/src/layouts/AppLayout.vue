<template>
  <component :is="layout">
    <slot />
  </component>
</template>

<script setup>
import { shallowRef, watch } from 'vue';
import { useRoute } from 'vue-router';
import AppLayoutDefault from './AppLayoutDefault.vue';
import AppLayoutHeader from './AppLayoutHeader.vue';
import AppLayoutSidebar from './AppLayoutSidebar.vue';

const layouts = {
  AppLayoutDefault,
  AppLayoutHeader,
  AppLayoutSidebar,
};

const route = useRoute();
const layout = shallowRef(null);

// Наблюдаем за изменением маршрута
watch(
  () => route.meta,
  async (meta) => {
    try {
      if (meta.layout) {
        // Пробуем найти компонент из свойства meta и динамически импортировать его
        layout.value = layouts[meta.layout] || AppLayoutDefault;
      } else {
        layout.value = AppLayoutDefault;
      }
    } catch (e) {
      console.error('Динамический шаблон не найден. Установлен шаблон по-умолчанию.', e);
      layout.value = AppLayoutDefault;
    }
  },
);
</script>

<style lang="scss" scoped>
.app_layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.content {
  display: flex;
  flex-grow: 1;
}
</style>
