<template>
  <section class="grid grid-cols-4 gap-4 mb-4">
    <SelectField :header="$t('event-type')" :options="[]" class="flex-grow" />
    <div class="flex items-end">
      <ToggleGeoLocation @click="$emit('tracking', $event)" />
      <SelectField
        :header="$t('where')"
        :options="formattedLocations"
        :default="selectedLocation"
        class="flex-grow"
        @change="$emit('zoom', $event)"
      />
    </div>
    <div>
      <DatePicker :id="'filter-date'" :label="$t('date-range')" />
    </div>
    <div>
      <!-- Toggle Calendar / Map views -->
    </div>
  </section>
</template>

<script>
import SelectField from '@/components/atoms/SelectField'
import ToggleGeoLocation from '@/components/map/ToggleGeoLocation'
import DatePicker from '@/components/atoms/DatePicker'

export default {
  name: 'Strainer',

  compoennts: {
    SelectField,
    ToggleGeoLocation,
    DatePicker,
  },

  props: {
    features: {
      type: Array,
      default: () => [],
      required: true,
    },
    locations: {
      type: Array,
      default: () => [],
      required: true,
    },
  },

  mounted() {
    this.formatLocations(this.locations)
  },

  data() {
    return {
      formattedLocations: [],
      selectedLocation: '',
      apiGeoAdminBbox: '2533863,1176363,2541963,1186738',
      eventsType: [],
    }
  },

  methods: {
    formatLocations(locations) {
      locations.forEach((location) => {
        this.formattedLocations.push({
          label: location.attrs.detail,
          attrs: location.attrs,
        })
      })
    },
  },
}
</script>
