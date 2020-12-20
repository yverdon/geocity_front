<template>
  <header>
    <div class="md:flex justify-between items-center my-4 mb-12">
      <Logo />
      <a href="#" class="hidden btn btn--primary mt-6 md:mt-0">{{
        $t('connexion')
      }}</a>
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
}
</script>

<style>
@media (max-width: 1024px) {
  header {
    height: 50px;
  }
}
</style>
