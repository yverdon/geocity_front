<template>
  <div class="container relative mx-auto px-4">
    <FullCalendar :options="calendarOptions" />
    <Modal :content="modalContent" />
  </div>
</template>

<script>
import Modal from '@/components/atoms/Modal'
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
    Modal,
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
          right: 'timeGridDay,timeGridWeek,dayGridMonth,listWeek',
        },
        eventClick: this.handleEventClick,
        initialView: window.innerWidth >= 1024 ? 'dayGridMonth' : 'listWeek',
        locale: fr,
        initialEvents: [],
        events: [],
      },
      modalContent: {},
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
      this.modalContent = {
        title: info.event.title,
        comment: info.event.extendedProps.comment,
        link: info.event.extendedProps.externalLink,
        start: info.event.start,
        end: info.event.end,
      }

      this.$modal.show('calendar-modal')
    },
  },
}
</script>

<style lang="postcss">
.fc .fc-view-harness {
  @apply bg-negative;
}

.fc-list-day th {
  z-index: 10;
  position: relative;
}

@media (max-width: 1024px) {
  .fc .fc-timeGridDay-button,
  .fc .fc-timeGridWeek-button,
  .fc .fc-dayGridMonth-button,
  .fc .fc-listWeek-button {
    @apply hidden;
  }

  .fc .fc-toolbar-title {
    @apply block text-sm;
  }
}
</style>
