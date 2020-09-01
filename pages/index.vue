<template>
  <div>
    <Introduction class="container mx-auto px-4" />
    <Search />
    <Map :events="events" />
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

  async asyncData({ $axios }) {
    const { data } = await $axios.get(
      'https://form-preprod.mapnv.ch/rest/events/'
    )
    return { events: data }
  },
}
</script>
