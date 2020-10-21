<template>
  <div>
    <Introduction class="container mx-auto px-4" />
    <Map :events="events" :locations="locations" />
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
    const events = await $axios.get(
      'https://form-preprod.mapnv.ch/rest/events/'
    )
    const locations = await $axios.get(
      'https://api3.geo.admin.ch/rest/services/api/SearchServer?limit=20&partitionlimit=24&type=locations&sr=2056&lang=fr&origins=address&bbox=2533863,1176363,2541963,1186738'
    )

    return {
      events: events.data,
      locations: locations.data.results,
    }
  },
}
</script>
