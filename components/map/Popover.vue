<template>
  <section
    v-if="feature.properties"
    class="w-64 p-4 pb-10 relative bg-negative border-solid border-brand border-2"
  >
    <header class="h-6 flex items-center">
      <button class="ml-auto px-2" @click="$emit('close')">
        <svg-icon name="close" class="icon--50" />
      </button>
    </header>

    <ul>
      <li v-if="name" class="font-bold mb-4">{{ name }}</li>
      <li v-if="start">
        {{ $t('start') }}: {{ $dateFns.format(start, 'dd.MM.yyyy') }}
      </li>
      <li v-if="end">
        {{ $t('end') }}: {{ $dateFns.format(end, 'dd.MM.yyyy') }}
      </li>
      <li v-if="comment">{{ $t('details') }}: {{ comment }}</li>
      <li v-if="link">{{ $t('more') }}: {{ link }}</li>
    </ul>

    <button class="btn btn--primary btn-calendar text-sm mt-4">
      <svg-icon name="calendar" class="icon--50 mr-2" />
      {{ $t('see-on-calendar') }}
    </button>
  </section>
</template>

<script>
export default {
  name: 'Popover',

  props: {
    feature: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      name: this.feature.properties.permit_request.administrative_entity.name,
      start: this.feature.properties.starts_at,
      end: this.feature.properties.ends_at,
      comment: this.feature.properties.comment,
      link: this.feature.properties.external_link,
    }
  },
}
</script>

<style lang="postcss" scoped>
li + li {
  @apply border-solid border-t-1;
}

li:last-child {
  @apply border-solid border-b-1;
}

.btn-calendar {
  width: 80%;
  @apply absolute;
  bottom: -15px;
  left: 50%;

  line-height: 1;
  transform: translate(-50%, 0);
}
</style>
