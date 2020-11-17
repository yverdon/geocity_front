<template>
  <div class="container relative mx-auto px-4">
    <FullCalendar :options="calendarOptions" />
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'

export default {
  name: 'Calendar',

  components: {
    FullCalendar,
  },

  props: {
    events: {
      type: Object,
      default: () => {},
      required: true,
    },
  },

  data() {
    return {
      calendarOptions: {
        plugins: [interactionPlugin, timeGridPlugin],
        initialView: 'timeGridWeek',
        nowIndicator: true,
        editable: true,
        initialEvents: [],
        events: [],
      },
    }
  },

  mounted() {
    this.formatFeatures(this.events.features)
  },

  methods: {
    formatFeatures(features) {
      features.forEach((feature) => {
        this.calendarOptions.events.push({
          title: feature.properties.permit_request.administrative_entity.name,
          start: feature.properties.starts_at,
          end: feature.properties.ends_at,
        })
      })
    },
  },
}
</script>
