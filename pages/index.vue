<template>
  <div
    :class="{ 'bg-gray-200 animate-pulse': isLoading }"
    class="flex-grow mt-12 py-12 bg-gray-100"
  >
    <div v-if="!isLoading">
      <Strainer
        :events="events"
        :locations="locations"
        @tracking="trackingFilter"
        @zoom="locationFilter"
        @filter-query="filter"
        @toggle="view = $event"
      />
      <Map v-if="view === 'map'" ref="map" :events="events" />
      <Calendar v-else ref="calendar" :events="events" />
    </div>
  </div>
</template>

<script>
import { format, parseISO, subYears, addYears } from 'date-fns'

import eventsType from '@/components/map/eventsType.json'

import Map from '@/components/map/Map'
import Calendar from '@/components/calendar/Calendar'
import Strainer from '@/components/filter/Strainer'

export default {
  components: {
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
      isLoading: true,
    }
  },

  data() {
    return {
      view: 'calendar',
    }
  },

  mounted() {
    this.isLoading = false
  },

  methods: {
    trackingFilter(isActive) {
      this.$refs.map.setTrackingActive(isActive)
    },

    locationFilter(location) {
      this.$refs.map.zoomToCoordinates(location)
    },

    filter(query) {
      if (this.view === 'map') {
        this.$refs.map.filterFeatures(query)
      } else {
        this.$refs.calendar.filterFeatures(query)
      }
    },
  },
}
</script>
