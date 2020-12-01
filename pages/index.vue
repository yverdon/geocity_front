<template>
  <div>
    <Introduction class="container mx-auto px-4" />
    <div class="mt-12 py-12 bg-gray-100">
      <Strainer
        :events="events"
        :locations="locations"
        @tracking="trackingFilter"
        @zoom="locationFilter"
        @filter-query="filter"
        @toggle="view = $event"
      />
      <Map v-if="view === 'map'" ref="map" :events="events" />
      <Calendar v-else />
    </div>
  </div>
</template>

<script>
import { format, parseISO, subYears, addYears } from 'date-fns'

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
    const start =
      process.env.GEOCITY_API_EVENTS_START.length > 0
        ? parseISO(process.env.GEOCITY_API_EVENTS_START)
        : subYears(new Date(), 1)

    const end =
      process.env.GEOCITY_API_EVENTS_END.length > 0
        ? parseISO(process.env.GEOCITY_API_EVENTS_END)
        : addYears(new Date(), 1)

    const events = await $axios.get(
      `${process.env.GEOCITY_API}?starts_at=${format(
        start,
        'yyyy-MM-dd'
      )}&ends_at=${format(end, 'yyyy-MM-dd')}`
    )
    const locations = await $axios.get(process.env.LOCATION_API)

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

    filter(query) {
      this.$refs.map.filterFeatures(query)
    },
  },
}
</script>
