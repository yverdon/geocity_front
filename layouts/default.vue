<template>
  <div class="container flex flex-col min-h-screen mx-auto px-4">
    <Header />
    <Nuxt />
    <Footer />
  </div>
</template>

<script>
import Header from '~/components/header.vue'
import Footer from '~/components/footer.vue'

export default {
  components: {
    Header,
    Footer,
  },
}
</script>
