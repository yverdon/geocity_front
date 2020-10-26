<template>
  <div>
    <Introduction class="container mx-auto px-4" />
    <div class="mt-12 py-12 bg-gray-100">
      <Strainer
        :events="events"
        :locations="locations"
        @tracking="trackingFilter"
        @zoom="locationFilter"
        @filter-event="eventFilter"
        @toggle="view = $event"
      />
      <Map v-if="view === 'map'" ref="map" :events="events" />
      <Calendar v-else />
    </div>
  </div>
</template>

<script>
import eventsType from '@/components/map/eventsType.json'

import Introduction from '@/components/layers/Introduction.vue'
import Map from '@/components/map/Map.vue'
import Calendar from '@/components/calendar/Calendar.vue'
import Strainer from '@/components/filter/Strainer'

export default {
  components: {
    Introduction,
    Map,
    Calendar,
    Strainer,
  },

  async asyncData({ $axios }) {
    const events = await $axios.get(
      'https://form-preprod.mapnv.ch/rest/events/'
    )
    const locations = await $axios.get(
      'https://api3.geo.admin.ch/rest/services/api/SearchServer?limit=20&partitionlimit=24&type=locations&sr=2056&lang=fr&origins=address&bbox=2533863,1176363,2541963,1186738'
    )

    const eventWithType = Object.assign(events.data, { type: eventsType })

    return {
      events: eventWithType,
      locations: locations.data.results,
    }
  },

  data() {
    return {
      view: 'map',
    }
  },

  methods: {
    trackingFilter(isActive) {
      this.$refs.map.setTrackingActive(isActive)
    },

    locationFilter(location) {
      this.$refs.map.zoomToCoordinates(location)
    },

    eventFilter(event) {
      this.$refs.map.filterEventsByType(event)
    },
  },
}
</script>
