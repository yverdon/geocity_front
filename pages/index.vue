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
      '/events/?adminentity=1&ends_at=2020-12-30&format=json&starts_at=2020-01-01'
    )
    return { events: data }
  },
}
</script>
