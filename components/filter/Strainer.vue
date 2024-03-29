<template>
  <div class="container relative mx-auto px-4">
    <section class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <SelectField
          :header="$t('event-type')"
          :options="formattedEvents"
          class="flex-grow"
          @change="typeFilter($event)"
        />
        <div v-if="hasLocationAPI"
          :class="{
            'hidden md:flex md:items-end': switcherSelected === 'calendar',
            'flex items-end': switcherSelected === 'map',
          }"
        >
          <SelectField
            :header="$t('where')"
            :options="formattedLocations"
            :disabled="switcherSelected === 'map' ? false : true"
            class="flex-grow"
            @change="$emit('zoom', $event)"
          />
        </div>
      </div>
      <div>
        <div
          :class="{
            'hidden md:block': switcherSelected === 'calendar',
          }"
        >
          <DatePicker
            :id="'filter-date'"
            :label="$t('date-range')"
            :disabled="switcherSelected === 'map' ? false : true"
            @change="dateFilter($event)"
          />
        </div>
        <div v-if="hasLocationAPI"
          :class="{
            'mt-8 flex': switcherSelected === 'map',
            'md:mt-8 flex': switcherSelected === 'calendar',
          }"
        >
          <ToggleSwitch
            :options="switcherOption"
            :selected="switcherSelected"
            :group="switcherGroupName"
            class="flex-grow"
            @toggle="toggleSwitcher"
          />
          <ToggleGeoLocation
            :disabled="switcherSelected === 'map' ? false : true"
            class="flex-none"
            @click="$emit('tracking', $event)"
          />
        </div>
      </div>
    </section>
    <section class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
      <div v-if="hasLocationAPI === false"
        :class="{
          'mt-8 flex': switcherSelected === 'map',
          'md:mt-8 flex': switcherSelected === 'calendar',
        }"
      >
        <ToggleSwitch
          :options="switcherOption"
          :selected="switcherSelected"
          :group="switcherGroupName"
          class="flex-grow"
          @toggle="toggleSwitcher"
        />
        <ToggleGeoLocation
          :disabled="switcherSelected === 'map' ? false : true"
          class="flex-none"
          @click="$emit('tracking', $event)"
        />
      </div>
    </section>
  </div>
</template>

<script>
import { subYears, addYears } from 'date-fns'

import SelectField from '@/components/atoms/SelectField'
import ToggleGeoLocation from '@/components/map/ToggleGeoLocation'
import DatePicker from '@/components/atoms/DatePicker'
import ToggleSwitch from '@/components/atoms/ToggleSwitch'

export default {
  name: 'Strainer',

  components: {
    SelectField,
    ToggleGeoLocation,
    DatePicker,
    ToggleSwitch,
  },

  props: {
    events: {
      type: Object,
      default: () => {},
      required: true,
    },
    locations: {
      type: Array,
      default: () => [],
      required: true,
    },
    view: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      formattedLocations: [],
      formattedEvents: [],
      switcherOption: [
        { id: 'calendar', value: this.$nuxt.$t('calendar') },
        { id: 'map', value: this.$nuxt.$t('map') },
      ],
      switcherGroupName: 'toggle-views',
      typeQuery: [],
      datesQuery: [subYears(new Date(), 1), addYears(new Date(), 1)],
    }
  },

  computed: {
    switcherSelected() {
      return this.view
    },

    hasLocationAPI() {
      if (`${process.env.LOCATION_API}`){
        return true
      }
      else {
        return false
      }
    },
  },

  mounted() {
    this.formatLocations(this.locations)
    this.formatEvents(this.events)
  },

  methods: {
    typeFilter(payload) {
      if (payload !== null) {
        this.typeQuery = [payload.id, payload.label]
      } else {
        this.typeQuery = []
      }

      this.emitFilterQuery()
    },

    dateFilter(payload) {
      if (!payload.length) {
        this.datesQuery = [subYears(new Date(), 1), addYears(new Date(), 1)]
      } else if (payload[1]) {
        this.datesQuery = [payload[0], payload[1]]
      } else {
        return
      }

      this.emitFilterQuery()
    },

    emitFilterQuery() {
      this.$emit('filter-query', {
        type: this.typeQuery,
        dates: this.datesQuery,
      })
    },

    toggleSwitcher(selected) {
      this.$emit('toggle', selected)
    },

    formatLocations(locations) {
      locations.forEach((location) => {
        this.formattedLocations.push({
          label: location.attrs.detail,
          attrs: location.attrs,
        })
      })
    },

    formatEvents(events) {
      events.type.forEach((event) => {
        this.formattedEvents.push({
          label: event.label,
          id: event.id,
        })
      })
    },
  },
}
</script>
