<template>
  <div class="md:flex justify-between items-center my-4 mb-12">
    <Logo />
    <a href="#" class="hidden btn btn--primary mt-6 md:mt-0">{{
      $t('connexion')
    }}</a>
  </div>
</template>

<script>
import Logo from '@/components/layers/Logo.vue'

export default {
  components: {
    Logo,
  },
}
</script>
