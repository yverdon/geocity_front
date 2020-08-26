<template>
  <div class="flex justify-between items-center my-4 mb-12">
    <Logo />
    <a href="#" class="btn btn--primary">{{ $t('connexion') }}</a>
  </div>
</template>

<script>
import Logo from '~/components/logo.vue'

export default {
  components: {
    Logo,
  },
}
</script>
