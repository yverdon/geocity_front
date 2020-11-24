<template>
  <div class="container relative mx-auto px-4">
    <FullCalendar :options="calendarOptions" />
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import fr from '@fullcalendar/core/locales/fr'

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
        aspectRatio: 2,
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
        },
        eventClick: this.handleEventClick,
        initialView: 'dayGridMonth',
        locale: fr,
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
      this.calendarOptions.events = []
      features.forEach((feature) => {
        this.calendarOptions.events.push({
          title: feature.properties.permit_request.administrative_entity.name,
          comment: feature.properties.comment,
          externalLink: feature.properties.external_link,
          start: feature.properties.starts_at,
          end: feature.properties.ends_at,
        })
      })
    },

    /**
     * Filter Features
     * @param {Object} query
     * Get the query search selected thought the `Strainer` component and
     * filter the data `features` Object to pass down the filtred `features`
     * to the `FullCalendar` component.
     */
    filterFeatures(query) {
      const filterdFeatures = []
      if (!query.type.length) {
        this.formatFeatures(this.events.features)
        return
      }

      this.events.features.filter((feature) => {
        if (feature.properties.permit_request.meta_types[0] === query.type[0]) {
          filterdFeatures.push(feature)
        }
      })
      this.formatFeatures(filterdFeatures)
    },

    handleEventClick(info) {
      console.log(info)
      console.log(info.event.title)
      console.log(info.event.extendedProps.comment)
      console.log(info.event.extendedProps.externalLink)
      console.log(info.event.start)
      console.log(info.event.end)
    },
  },
}
</script>

<style lang="postcss">
.fc .fc-view-harness {
  @apply bg-negative;
}
</style>
