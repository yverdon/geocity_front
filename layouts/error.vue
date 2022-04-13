<template>
  <div class="m-auto">
    <p>{{ $t('error') }} : error {{ error.statusCode }}</p>
  </div>
</template>

<script>
export default {
  layout: 'empty',
  // eslint-disable-next-line vue/require-prop-types
  props: ['error'],
}
</script>
