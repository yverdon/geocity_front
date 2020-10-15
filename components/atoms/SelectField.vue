<template>
  <div>
    <client-only>
      <v-select
        v-model="selected"
        :options="locations"
        @input="$emit('change', selected)"
      >
        <template #option="{ label }">
          <span v-html="label"></span>
        </template>
      </v-select>
    </client-only>
  </div>
</template>

<script>
export default {
  Name: 'SelectField',

  async fetch() {
    const data = await this.$axios.$get(
      `https://api3.geo.admin.ch/rest/services/api/SearchServer?limit=20&partitionlimit=24&type=locations&sr=2056&lang=fr&origins=address&bbox=${this.bbox}`
    )

    this.formatLocations(data.results)
  },

  data() {
    return {
      selected: '',
      bbox: '2533863,1176363,2541963,1186738',
      locations: [],
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
