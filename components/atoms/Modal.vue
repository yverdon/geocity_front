<template>
  <vue-modal
    v-if="content"
    adaptive
    :width="setWidth"
    :max-width="600"
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
      <li v-if="content.start" class="flex py-2">
        <span class="font-bold pr-2">{{ $t('start') }}:</span>
        {{ $dateFns.format(content.start, 'dd.MM.yyyy') }}
      </li>
      <li v-if="content.end" class="flex py-2">
        <span class="font-bold pr-2">{{ $t('end') }}:</span>
        {{ $dateFns.format(content.end, 'dd.MM.yyyy') }}
      </li>
      <li v-if="content.comment" class="flex py-2">
        <span class="font-bold pr-2">{{ $t('details') }}:</span>
        {{ content.comment }}
      </li>
      <li v-if="content.link" class="flex py-2">
        <span class="font-bold pr-2">{{ $t('more') }}:</span>
        <a :href="content.link" class="text-brand hover:text-brand-dark">{{
          content.link
        }}</a>
      </li>
    </ul>
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
.vm--modal {
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
