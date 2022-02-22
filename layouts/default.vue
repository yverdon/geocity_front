<template>
  <div class="flex flex-col min-h-screen">
    <Header v-if="isLayoutDisplay" class="container mx-auto px-4" />
    <Nuxt />
    <Footer v-if="isLayoutDisplay" class="container mx-auto px-4" />
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

  data() {
    return {
      isLayoutDisplay: process.env.DISPLAY_FOOTER_AND_HEADER === 'true',
    }
  },
}
</script>
