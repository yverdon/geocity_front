<template>
  <div>
    <Introduction class="container mx-auto px-4" />
    <Search />
    <Map />
  </div>
</template>

<script>
import Introduction from '~/components/introduction.vue'
import Search from '~/components/search.vue'
import Map from '~/components/map.vue'

export default {
  components: {
    Introduction,
    Search,
    Map,
  },
}
</script>
