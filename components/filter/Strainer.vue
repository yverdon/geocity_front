<template>
  <section class="grid grid-cols-4 gap-4 mb-4">
    <SelectField :header="$t('event-type')" :options="[]" class="flex-grow" />
    <div class="flex items-end">
      <ToggleGeoLocation @click="$emit('tracking', $event)" />
      <SelectField
        :header="$t('where')"
        :options="locations"
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
      required: true,
    },
  },

  async fetch() {
    const data = await this.$axios.$get(
      `https://api3.geo.admin.ch/rest/services/api/SearchServer?limit=20&partitionlimit=24&type=locations&sr=2056&lang=fr&origins=address&bbox=${this.apiGeoAdminBbox}`
    )

    this.formatLocations(data.results)
  },

  data() {
    return {
      locations: [],
      selectedLocation: '',
      apiGeoAdminBbox: '2533863,1176363,2541963,1186738',
      eventsType: [],
    }
  },

  methods: {
    formatLocations(locations) {
      locations.forEach((location) => {
        this.locations.push({
          label: location.attrs.detail,
          attrs: location.attrs,
        })
      })
    },
  },
}
</script>
