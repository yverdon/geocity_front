<template>
  <div class="container relative mx-auto px-4">
    <section class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <SelectField
          :header="$t('event-type')"
          :options="formattedEvents"
          class="flex-grow"
          @change="$emit('filter-event', $event)"
        />
        <div class="flex items-end">
          <SelectField
            :header="$t('where')"
            :options="formattedLocations"
            class="flex-grow"
            @change="$emit('zoom', $event)"
          />
          <ToggleGeoLocation @click="$emit('tracking', $event)" />
        </div>
      </div>
      <div>
        <div>
          <DatePicker
            :id="'filter-date'"
            :label="$t('date-range')"
            @change="$emit('filter-date', $event)"
          />
        </div>
        <div>
          <ToggleSwitch
            :options="switcherOption"
            :selected="switcherSelected"
            :group="switcherGroupName"
            @toggle="toggleSwitcher"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import SelectField from '@/components/atoms/SelectField'
import ToggleGeoLocation from '@/components/map/ToggleGeoLocation'
import DatePicker from '@/components/atoms/DatePicker'
import ToggleSwitch from '@/components/atoms/ToggleSwitch'

export default {
  name: 'Strainer',

  compoennts: {
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
  },

  data() {
    return {
      formattedLocations: [],
      formattedEvents: [],
      switcherOption: ['map', 'calendar'],
      switcherSelected: 'map',
      switcherGroupName: 'toggle-views',
    }
  },

  mounted() {
    this.formatLocations(this.locations)
    this.formatEvents(this.events)
  },

  methods: {
    toggleSwitcher(selected) {
      this.switcherSelected = selected
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
