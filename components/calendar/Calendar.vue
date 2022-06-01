<template>
  <div class="container relative mx-auto px-4">
    <div class="mx-1">
      <FullCalendar :options="calendarOptions" />
    </div>

    <Modal
      :name="'calendar-modal'"
      :content="modalContent"
      @modal-trigger-map="modalTrigger"
    />
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import fr from '@fullcalendar/core/locales/fr'

import Modal from '@/components/atoms/Modal'

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
        height: 600,
        aspectRatio: 2,
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridDay,timeGridWeek,dayGridMonth,listMonth',
        },
        dayMaxEvents: 0,
        eventMaxStack: 3,
        eventDisplay: 'block',
        eventOrder: 'title,start,-duration,allDay',
        eventClick: this.handleEventClick,
        initialView:
          process.env.DEFAULT_CALENDAR_MODE !== 'default'
            ? process.env.DEFAULT_CALENDAR_MODE
            : window.innerWidth >= 1024
            ? 'dayGridMonth'
            : 'listWeek',
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
    modalTrigger(feature) {
      this.$emit('calendar-trigger-map', feature)
    },

    formatFeatures(features) {
      this.calendarOptions.events = []
      features.forEach((feature) => {
        this.calendarOptions.events.push({
          title:
            feature.properties.permit_request.shortname === ''
              ? feature.properties.permit_request.administrative_entity.name
              : feature.properties.permit_request.shortname,
          comment: feature.properties.comment,
          externalLink: feature.properties.external_link,
          start: feature.properties.starts_at,
          end: feature.properties.ends_at,
          feature,
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

      // eslint-disable-next-line array-callback-return
      this.events.features.filter((feature) => {
        if (feature.properties.permit_request.meta_types[0] === query.type[0]) {
          filterdFeatures.push(feature)
        }
      })
      this.formatFeatures(filterdFeatures)
    },

    async handleEventClick(info) {
      let permitsDetails = {}
      if (this.$store.state.user.is_logged) {
        permitsDetails = await this.$store.dispatch(
          'getPermitsDetails',
          info.event.extendedProps.feature.properties.permit_request.id
        )
      }

      this.modalContent = {
        title: info.event.title,
        comment: info.event.extendedProps.comment,
        link: info.event.extendedProps.externalLink,
        start: info.event.start,
        end: info.event.end,
        permitsDetails: permitsDetails ? permitsDetails.wot_properties : {},
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

.fc .fc-button,
.fc .fc-button,
.fc .fc-button,
.fc .fc-button {
  @apply py-1 px-2;
  @apply text-sm;
  @apply rounded-none;
  @apply bg-gray-900 text-negative;

  &:hover {
    @apply bg-gray-700;
  }

  &:focus {
    @apply outline-none shadow-outline;
  }

  &[disabled] {
    @apply bg-gray-900;
  }
}

.fc .fc-toolbar-title {
  @apply block text-lead;
}

.fc .fc-daygrid-day.fc-day-today,
.fc .fc-timegrid-col.fc-day-today {
  @apply bg-brand-light;
}

.fc .fc-list-event td,
.fc-h-event .fc-event-title-container,
.fc-v-event .fc-event-title-container,
.fc-daygrid-dot-event .fc-event-title {
  @apply cursor-pointer;
}

@media (max-width: 1024px) {
  .fc .fc-timeGridDay-button,
  .fc .fc-timeGridWeek-button,
  .fc .fc-dayGridMonth-button,
  .fc .fc-listMonth-button,
  .fc .fc-listWeek-button {
    @apply hidden;
  }

  .fc .fc-toolbar-title {
    @apply block text-base;
  }
}

@media (max-width: 800px) {
  .fc .fc-toolbar {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
