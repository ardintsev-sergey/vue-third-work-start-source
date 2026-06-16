<template>
  <div class="task-card">
    <section
      ref="dialog"
      class="task-card__wrapper"
      tabindex="-1">
      <button
        class="task-card__close"
        type="button"
        aria-label="Close task"
        @click="closeDialog" />

      <div class="task-card__block">
        <div class="task-card__row">
          <h1 class="task-card__name task-card__name--min">
            {{ task?.title || '' }}
          </h1>
          <button
            class="task-card__edit"
            type="button">
            Редактировать задачу
          </button>
        </div>
        <p class="task-card__date">
          {{ taskCardDate }}
        </p>
      </div>

      <div class="task-card__block">
        <ul class="task-card__params">
          <li v-if="task?.user">
            Участник:
            <div class="task-card__participant">
              <button
                type="button"
                class="task-card__user">
                <img
                  :src="getImage(task.user.avatar)"
                  :alt="task.user.name" />
                {{ task.user.name }}
              </button>
            </div>
          </li>
          <li v-if="dueDate">
            Срок:
            <button
              type="button"
              class="task-card__date-link">
              {{ dueDate }}
            </button>
          </li>
        </ul>
      </div>

      <div
        v-if="task?.description"
        class="task-card__block task-card__description">
        <h4 class="task-card__title">Описание</h4>
        <p>{{ task.description }}</p>
      </div>

      <div
        v-if="task?.url"
        class="task-card__block task-card__links">
        <h4 class="task-card__title">Ссылки</h4>
        <div class="task-card__links-item">
          <a
            :href="task.url"
            target="_blank"
            rel="noopener noreferrer">
            {{ task.urlDescription || 'ссылка' }}
          </a>
        </div>
      </div>

      <div
        v-if="task?.tags"
        class="task-card__block">
        <h4 class="task-card__title">Метки</h4>
        <task-card-tags :tags="task.tags" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getImage, getReadableDate } from '../common/helpers';
import { useTaskCardDate } from '../common/composables';
import TaskCardTags from '../modules/tasks/components/TaskCardTags.vue';

const props = defineProps({
  tasks: {
    type: Array,
    required: true,
  },
});

const router = useRouter();
const route = useRoute();
const dialog = ref(null);

const task = computed(() => props.tasks.find((item) => String(item.id) === String(route.params.id)));

const dueDate = computed(() => getReadableDate(task.value?.dueDate || ''));

const taskCardDate = computed(() => {
  if (!task.value) {
    return '';
  }

  return useTaskCardDate(task.value).value;
});

function closeDialog() {
  router.push('/');
}

onMounted(async () => {
  await nextTick();
  dialog.value?.focus();
});
</script>

<style lang="scss" scoped>
@import '@/assets/scss/app.scss';

.task-card {
  position: fixed;
  inset: 0;
  z-index: 100;
  overflow-x: auto;
  box-sizing: border-box;
  padding: 50px 16px;
  background: rgba($gray-900, 0.6);

  &__wrapper {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    padding: 40px;
    outline: none;
    background-color: $white-900;
    box-shadow: 0 4px 8px $shadow-500;
  }

  &__close {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    border: none;
    background-color: transparent;

    &::after,
    &::before {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 1px;
      content: '';
      background-color: $blue-gray-300;
      transition: background-color $animationSpeed;
    }

    &::after {
      transform: translate(-50%, -50%) rotate(45deg);
    }

    &::before {
      transform: translate(-50%, -50%) rotate(-45deg);
    }

    &:hover::before,
    &:hover::after {
      background-color: $blue-700;
    }
  }

  &__block {
    margin-bottom: 30px;
  }

  &__row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }

  &__name {
    width: 100%;
    margin: 0;
    color: $gray-900;
    @include m-s24-h21;

    &--min {
      max-width: 59%;
    }
  }

  &__edit {
    margin: 3px 0 0;
    padding: 0;
    cursor: default;
    opacity: 0.5;
    color: $blue-gray-600;
    border: none;
    background-color: transparent;
    @include r-s14-h16;
  }

  &__date {
    margin-top: 5px;
    margin-bottom: 0;
    color: $blue-gray-300;
    @include r-s14-h21;
  }

  &__params {
    color: $gray-900;
    @include clear-list;
    @include r-s16-h21;

    li {
      display: flex;
      align-items: center;
      min-height: 30px;
      margin-bottom: 15px;
    }
  }

  &__participant {
    display: inline-block;
    margin-left: 10px;
    vertical-align: baseline;
  }

  &__user,
  &__date-link {
    display: flex;
    align-items: center;
    width: 100%;
    margin: 0;
    text-align: left;
    border: 0;
    background-color: transparent;
    @include r-s14-h16;

    img {
      width: 30px;
      height: 30px;
      margin-right: 10px;
      border-radius: 50%;
    }
  }

  &__date-link {
    color: $gray-900;
    @include r-s16-h21;
  }

  &__title {
    margin: 0;
    color: $gray-900;
    @include m-s18-h21;
  }

  &__description p {
    margin-top: 16px;
    margin-bottom: 0;
    color: $blue-gray-600;
    @include r-s14-h21;
  }

  &__links-item {
    margin-top: 16px;
    color: $blue-gray-300;
    @include r-s14-h21;

    a {
      color: $blue-600;
    }
  }
}
</style>
