<template>
  <div class="flex flex-col min-h-screen">
    <Header class="container mx-auto px-4" />
    <Nuxt />
    <Footer class="container mx-auto px-4" />
  </div>
</template>

<script>
import Header from '@/components/layers/Header.vue'
import Footer from '@/components/layers/Footer.vue'

export default {
  components: {
    Header,
    Footer,
  },
}
</script>
