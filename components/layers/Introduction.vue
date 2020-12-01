<template>
  <div class="grid md:grid-flow-col md:grid-cols-2">
    <p class="pb-6 md:pb-0 md:pr-12">
      {{ $t('introduction') }}
    </p>

    <div
      class="flex flex-col items-center border-t-1 md:border-t-0 md:border-l-1 border-brand pt-6 md:pt-0 md:pl-12"
    >
      <p>{{ $t('ask') }}</p>
      <a :href="setLink" target="_blank" class="btn btn--default mt-12">{{
        $t('askcta')
      }}</a>
    </div>
  </div>
</template>

<script>
export default {
  Name: 'Introduction',

  computed: {
    setLink() {
      return process.env.CTA_LINK
    },
  },
}
</script>
