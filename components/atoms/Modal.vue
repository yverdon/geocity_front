<template>
  <vue-modal
    v-if="content"
    scrollable
    adaptive
    :width="setWidth"
    :max-width="850"
    :height="'auto'"
    :name="name"
    @closed="$emit('close')"
  >
    <header class="flex items-center mb-4">
      <p v-if="content.title" class="text-lead">{{ content.title }}</p>
      <button
        class="btn btn--secondary btn--small ml-auto"
        @click="handleCloseButton"
      >
        <svg-icon name="close" class="icon--50" />
      </button>
    </header>

    <ul>
      <li v-if="content.start" class="flex flex-col md:flex-row py-2">
        <span class="w-80 font-bold pr-2">{{ $t('start') }}:</span>
        {{ $dateFns.format(content.start, 'dd.MM.yyyy') }}
      </li>
      <li v-if="content.end" class="flex flex-col md:flex-row py-2">
        <span class="w-80 font-bold pr-2">{{ $t('end') }}:</span>
        {{ $dateFns.format(content.end, 'dd.MM.yyyy') }}
      </li>
      <li v-if="content.comment" class="flex flex-col md:flex-row py-2">
        <span class="w-80 font-bold pr-2">{{ $t('details') }}:</span>
        {{ content.comment }}
      </li>
      <li v-if="content.link" class="flex flex-col md:flex-row py-2">
        <span class="w-80 font-bold pr-2">{{ $t('more') }}:</span>
        <a
          :href="content.link"
          target="_blank"
          class="text-brand hover:text-brand-dark"
        >
          {{ content.link }}
        </a>
      </li>
      <li v-if="content.comment" class="flex flex-col md:flex-row py-2">
        <span class="w-80 font-bold pr-2">{{ $t('details') }}:</span>
        {{ content.comment }}
      </li>
      <template v-if="content.permitsDetails">
        <template v-for="permitsDetail in content.permitsDetails">
          <li
            v-for="(detail, index) in permitsDetail"
            :key="detail[index]"
            class="flex flex-col md:flex-row py-2"
          >
            <template v-if="detail.key === 'work_object_type'">
              <p class="text-lead mt-4">{{ detail.value }}</p>
            </template>
            <template v-else>
              <span class="w-80 font-bold pr-2 flex-none">
                {{ detail.key }} :
              </span>
              <p>{{ detail.value }}</p>
            </template>
          </li>
        </template>
      </template>
    </ul>

    <section
      v-if="name === 'calendar-modal'"
      class="flex flex-col items-center mt-6"
    >
      <button
        class="btn btn--secondary"
        @click="$emit('modal-trigger-map', content.feature)"
      >
        {{ $t('see-on-map') }}
      </button>
    </section>
  </vue-modal>
</template>

<script>
export default {
  name: 'Modal',

  props: {
    name: {
      type: String,
      required: true,
    },
    content: {
      type: Object,
      required: true,
    },
  },

  computed: {
    setWidth() {
      return window.innerWidth - 20
    },
  },

  methods: {
    handleCloseButton() {
      this.$emit('close')
      this.$modal.hide(this.name)
    },
  },
}
</script>

<style lang="postcss">
.vm--container {
  @apply mt-4 pb-8;
  z-index: 10000;
}

.vm--modal {
  height: auto !important;
  @apply p-4;
  @apply border-brand border-2;
}

.vm--modal li + li {
  @apply border-solid border-t-1;
}

.vm--modal li:last-child {
  @apply border-solid border-b-1;
}
</style>
