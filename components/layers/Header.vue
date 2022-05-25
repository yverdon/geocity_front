<template>
  <header>
    <div class="my-4 lg:mb-12 md:flex justify-between items-center">
      <Logo />
      <a :href="setConnexionLink" class="btn btn--primary mt-6 md:mt-0">
        {{ $t('connexion') }}
      </a>
    </div>
    <Introduction />
  </header>
</template>

<script>
import Logo from '@/components/layers/Logo'
import Introduction from '@/components/layers/Introduction'

export default {
  components: {
    Logo,
    Introduction,
  },
  computed: {
    setConnexionLink() {
      return `${process.env.CTA_LINK}/account/login/?next=${process.env.PRODUCTION_PATH}`
    },
  },
}
</script>
