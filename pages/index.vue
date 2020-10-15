<template>
  <div>
    <Introduction class="container mx-auto px-4" />
    <Map :events="events" />
  </div>
</template>

<script>
import Introduction from '@/components/layers/Introduction.vue'
import Map from '@/components/map/Map.vue'

export default {
  components: {
    Introduction,
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
