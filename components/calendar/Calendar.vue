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
        const startsDisplay = new Date(feature.properties.starts_at)
        const startsAt = new Date(startsDisplay)
        const endsDisplay = new Date(feature.properties.ends_at)
        const endsAt = new Date(endsDisplay)

        const daySplitStart = process.env.DAY_SPLIT_START
        const daySplitEnd = process.env.DAY_SPLIT_END

        if (daySplitStart && daySplitEnd) {
          const isSameDay = startsAt.getDate() === endsDisplay.getDate()

          // If the day of start and end is not the same and event finish before daySplitStart, make the event finish 1 day earlier at daySplitEnd
          if (!isSameDay && endsDisplay.getHours() < daySplitStart) {
            endsAt.setDate(endsDisplay.getDate() - 1) // Remove 1 day
            endsAt.setHours(daySplitEnd, 0, 0, 0)
          }

          // If the day of start and end is not the same and event starts before daySplitEnd, make the event start 1 day later at daySplitStart
          if (!isSameDay && startsDisplay.getHours() > daySplitEnd) {
            startsAt.setDate(startsDisplay.getDate() + 1) // add 1 day
            startsAt.setHours(daySplitStart, 0, 0, 0)
          }
        }

        this.calendarOptions.events.push({
          title:
            feature.properties.submission.shortname === ''
              ? feature.properties.submission.administrative_entity.name
              : feature.properties.submission.shortname,
          comment: feature.properties.comment,
          externalLink: feature.properties.external_link,
          start: startsAt,
          end: endsAt,
          startDisplay: startsDisplay,
          endDisplay: endsDisplay,
          feature,
        })
      })
    },

    /**
     * Filter Features
     * @param {Object} query
     * Get the query search selected thought the `Strainer` component and
     * filter the data `features` Object to pass down the filtered `features`
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
        if (feature.properties.submission.meta_types[0] === query.type[0]) {
          filterdFeatures.push(feature)
        }
      })
      this.formatFeatures(filterdFeatures)
    },

    async handleEventClick(info) {
      let submissionsDetails = {}
      submissionsDetails = await this.$store.dispatch(
        'getSubmissionsDetails',
        info.event.extendedProps.feature.properties.submission.id
      )
      this.modalContent = {
        id: info.event.extendedProps.feature.properties.submission.id,
        title: info.event.title,
        comment: info.event.extendedProps.comment,
        link: info.event.extendedProps.externalLink,
        start: info.event.start,
        end: info.event.end,
        startDisplay: info.event.extendedProps.startDisplay,
        endDisplay: info.event.extendedProps.endDisplay,
        submissionsDetails: submissionsDetails
          ? submissionsDetails.fields_values
          : {},
        current_inquiry_documents: info.event.extendedProps.feature.properties
          .submission.current_inquiry
          ? info.event.extendedProps.feature.properties.submission
              .current_inquiry.documents
          : false,
        feature: info.event.extendedProps.feature,
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
