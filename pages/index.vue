<template>
  <div
    :class="{
      'bg-gray-200 animate-pulse': isLoading,
      'lg:mt-12': isLayoutDisplay,
    }"
    class="flex-grow py-6 lg:py-12 bg-gray-100"
  >
    <div v-if="!isLoading">
      <Strainer
        :events="events"
        :locations="locations"
        :view="view"
        @tracking="trackingFilter"
        @zoom="locationFilter"
        @filter-query="filter"
        @toggle="view = $event"
      />
      <Map v-if="view === 'map'" ref="map" :events="events" />
      <Calendar
        v-else
        ref="calendar"
        :events="events"
        @calendar-trigger-map="triggerMapFromModalCalendar"
      />
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

    const adminentities =
      process.env.GEOCITY_API_ADMINISTRATIVE_ENTITES.length > 0
        ? `&adminentities=${process.env.GEOCITY_API_ADMINISTRATIVE_ENTITES}`
        : ''

    const showonlyfuture =
      process.env.GEOCITY_API_SHOW_ONLY_FUTURE.length > 0
        ? `&show_only_future=${process.env.GEOCITY_API_SHOW_ONLY_FUTURE}`
        : ''

    const events = await $axios
      .get(
        `${process.env.GEOCITY_API}/events/?starts_at=${format(
          start,
          'yyyy-MM-dd'
        )}&ends_at=${format(
          end,
          'yyyy-MM-dd'
        )}${adminentities}${showonlyfuture}`
      )
      .then((response) => response)
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
      })

    const user = await $axios
      .get(`${process.env.GEOCITY_API}/current_user/`, {
        withCredentials: true,
      })
      .then((response) => response)
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
      })

    const locations = await $axios
      .get(process.env.LOCATION_API)
      .then((response) => response)
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
      })

    const eventWithType = Object.assign(events.data, { type: eventsType })

    return {
      events: eventWithType,
      locations: locations.data.results,
      isLoading: true,
      user: user.data,
    }
  },

  data() {
    return {
      view: process.env.DEFAULT_VIEW,
      isLayoutDisplay: process.env.DISPLAY_FOOTER_AND_HEADER === 'true',
    }
  },

  mounted() {
    this.isLoading = false
    this.$store.commit('setUser', this.user)
  },

  methods: {
    trackingFilter(isActive) {
      this.$refs.map.setTrackingActive(isActive)
    },

    locationFilter(location) {
      this.$refs.map.zoomToCoordinates(location)
    },

    triggerMapFromModalCalendar(feature) {
      this.view = 'map'

      // Add setTimeout otherwise the $refs.map was not define,
      setTimeout(() => {
        if (feature.bbox) {
          this.$refs.map.center = [
            feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2,
            feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2,
          ]
        }
        this.$refs.map.zoomDefault = 12
      }, 10)
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
