<template>
  <vue-modal v-if="content" adaptive name="calendar-modal">
    <ul>
      <li v-if="content.title" class="font-bold mb-4">{{ content.title }}</li>
      <li v-if="content.start">
        {{ $t('start') }}: {{ $dateFns.format(content.start, 'dd.MM.yyyy') }}
      </li>
      <li v-if="content.end">
        {{ $t('end') }}: {{ $dateFns.format(content.end, 'dd.MM.yyyy') }}
      </li>
      <li v-if="content.comment">{{ $t('details') }}: {{ content.comment }}</li>
      <li v-if="content.link">{{ $t('more') }}: {{ content.link }}</li>
    </ul>
  </vue-modal>
</template>

<script>
export default {
  name: 'Modal',

  props: {
    content: {
      type: Object,
      required: true,
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
