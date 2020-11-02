<template>
  <div class="container relative mx-auto px-4">
    <client-only>
      <vl-map
        :load-tiles-while-animating="true"
        :load-tiles-while-interacting="true"
        :style="{ cursor: mapCursor }"
        class="map cursor-pointer"
        @mounted="onMapMounted"
        @click="clickCoordinate = $event.coordinate"
        @pointermove="onMapPointerMove"
      >
        <vl-view
          :zoom.sync="zoomDefault"
          :center.sync="center"
          :rotation.sync="rotation"
          projection="EPSG:2056"
        />

        <vl-geoloc
          :tracking="isTrackingActive"
          @update:position="onUpdatePosition"
        >
          <template slot-scope="geoloc">
            <vl-feature v-if="geoloc.position && isTrackingActive">
              <vl-geom-point :coordinates="geoloc.position"></vl-geom-point>
              <vl-style-box>
                <vl-style-icon
                  src="/mapmarkers/geolocation.svg"
                  :scale="0.04"
                  :anchor="[0.5, 1]"
                ></vl-style-icon>
              </vl-style-box>
            </vl-feature>
          </template>
        </vl-geoloc>

        <vl-interaction-select :features.sync="selectedFeature">
          <template slot-scope="select">
            <vl-style-func :factory="styleFuncFactory" />
            <vl-overlay
              v-for="feature in select.features"
              :id="feature.id"
              :key="feature.id"
              :position="clickCoordinate"
              :auto-pan="true"
              :auto-pan-animation="{ duration: 300 }"
            >
              <Popover :feature="feature" @close="selectedFeature = []" />
            </vl-overlay>
          </template>
        </vl-interaction-select>

        <LayerTile :layers="baseLayers" />
        <LayerVector :features="features" :factory="styleFuncFactory" />
      </vl-map>

      <ToggleLayers />
    </client-only>
  </div>
</template>

<script>
import { areIntervalsOverlapping } from 'date-fns'

import layers from '@/components/map/layers.json'

import ToggleLayers from '@/components/map/ToggleLayers'
import Popover from '@/components/map/Popover'
import LayerTile from '@/components/map/LayerTile'
import LayerVector from '@/components/map/LayerVector'

export default {
  Name: 'Map',

  compoennts: {
    ToggleLayers,
    Popover,
    LayerTile,
    LayerVector,
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
      baseLayers: layers,
      zoomDefault: 8,
      rotation: 0,
      center: [2538236.1400353624, 1180746.4827439308],
      isTrackingActive: false,
      mapCursor: 'default',
      selectedByHover: null,

      map: [],
      features: [],
      selectedFeature: [],
      typeFilterQuery: {},
      dateFilterQuery: [],
      clickCoordinate: [],
      deviceCoordinate: [],
    }
  },

  mounted() {
    this.features = this.events.features
  },

  methods: {
    /**
     * On mounted Map instance
     * @param {Component instance} map
     * Add controls fullscreen & assign instance to map data.
     */
    onMapMounted(map) {
      map.$createPromise.then(() => {
        map.$map.addControl(this.$FullScreen)
        this.map = map
      })
    },

    /**
     * On Update Position
     * @param {Array} coordinate
     * Update device coordinate & set map view.
     */
    onUpdatePosition(coordinate) {
      this.deviceCoordinate = coordinate
      this.map.getView().setCenter(coordinate)
    },

    /**
     * Set Tracking Active
     * @param {Bool} isActive
     * Set Tracking active & center map view with
     * device coordinate
     */
    setTrackingActive(isActive) {
      if (isActive) {
        this.isTrackingActive = isActive
      }

      if (this.deviceCoordinate) {
        this.map.getView().setCenter(this.deviceCoordinate)
      }
    },

    /**
     * Zoom To Coordinate
     * @param {Array} location
     * Set the center to location values esle set to default
     * value centred on Yverdon-Les-Bains.
     */
    zoomToCoordinates(location) {
      if (location) {
        this.center = [location.attrs.y, location.attrs.x]
        this.zoomDefault = 10
      } else {
        this.center = [2538236.1400353624, 1180746.4827439308]
        this.zoomDefault = 8
      }
    },

    /**
     * Filter events by Type
     * @param {Object} event
     * Get the event selected thought the `SelectField` component and
     * filter the data `features` Object to pass down the filtred `features`
     * to the `LayerVector` component.
     * Note that if event is null we display all `features` as default.
     */
    eventsByType(event) {
      if (this.dateFilterQuery.length > 0) {
        this.eventsByDate(this.dateFilterQuery)
      } else {
        this.features = this.events.features
        this.dateFilterQuery = []
      }

      if (event === null) {
        this.typeFilterQuery = {}
        return
      }

      this.typeFilterQuery = event
      this.features = this.events.features.filter(
        (feature) =>
          feature.properties.permit_request.meta_types[0] === event.id
      )
    },

    /**
     * Filter events by Date
     * @param {Array} dates
     * Get the dates selected thought the `Datepicker` component and
     * filter the data `features` Array to pass down the filtred `features`
     * to the `LayerVector` component
     *
     * To do so, we check if the selected range date overlap the event range date
     * There is mutlitple possibility as describe below :
     *
     * Event range ░░░░░░░░░░════════════════════░░░░░░░░░░
     *          1/ ░═════════════════░░░░░░░░░░░░░░░░░░░░░░
     *          2/ ░░░░░░░░░░░░░░░░░░░░░══════════════════░
     *          3/ ░░░░░░░░░░░░░░░══════════░░░░░░░░░░░░░░░
     *          4/ ░░░░═══════════════════════════════░░░░░
     *          5/ ═══════░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
     *          6/ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░═══════
     *
     * Note that the options 1/ to 4/ will be display to the user and 5/ & 6/ will be hidden
     */
    eventsByDate(dates) {
      if (Object.keys(this.typeFilterQuery).length > 0) {
        this.eventsByType(this.typeFilterQuery)
      } else {
        this.features = this.events.features
        this.typeFilterQuery = {}
      }

      if (dates.length === 0) {
        this.dateFilterQuery = []
        return
      }

      const startSelectedDate = dates[0]
      let endSelectedDate = ''
      if (dates[1]) {
        endSelectedDate = dates[1]
      } else {
        return
      }

      this.dateFilterQuery = dates
      this.features = this.events.features.filter((feature) => {
        return areIntervalsOverlapping(
          { start: startSelectedDate, end: endSelectedDate },
          {
            start: new Date(feature.properties.starts_at),
            end: new Date(feature.properties.ends_at),
          }
        )
      })
    },

    /**
     * Style Function Factory
     * Return styled Map Markers for each type of event
     */
    styleFuncFactory() {
      return (feature) => {
        if (feature.getProperties().permit_request.meta_types) {
          // TODO-Question: Does an `event.type` can have multiple MetaType
          const typeStyle = this.events.type[
            feature.getProperties().permit_request.meta_types[0]
          ]
          const genericStyle = this.map.$createStyle({
            strokeColor: typeStyle.color,
            strokeWidth: 3,
            imageColor: typeStyle.color,
            imageFillColor: typeStyle.color,
            imageRadius: 14,
            imageOpacity: 1,
          })

          const colorFill = [...typeStyle.color]
          colorFill[3] = 0.5

          const polygonFillStyle = this.map.$createStyle({
            fillColor: colorFill,
          })

          const pointStyle = this.map.$createStyle({
            imageScale: 0.025,
            imageSrc: `/mapmarkers/${typeStyle.name}.svg`,
          })

          return [polygonFillStyle, genericStyle, pointStyle]
        }
      }
    },

    /**
     * On Map Pointer Move
     * @param {Array} pixel
     * Set highlighted style Map Markers for each type of event and change
     * default Map Cursor to pointer
     */
    onMapPointerMove({ pixel }) {
      const hit = this.map.forEachFeatureAtPixel(pixel, () => true)

      if (this.selectedByHover !== null) {
        this.selectedByHover.setStyle(undefined)
        this.selectedByHover = null
      }

      this.map.forEachFeatureAtPixel(
        pixel,
        function (f) {
          if (f.getProperties().permit_request.meta_types) {
            const typeStyle = this.events.type[
              f.getProperties().permit_request.meta_types[0]
            ]
            const highlightStyle = this.map.$createStyle({
              strokeColor: typeStyle.color,
              strokeWidth: 4,
              imageColor: typeStyle.color,
              imageFillColor: typeStyle.color,
              imageRadius: 14,
              imageOpacity: 1,
            })

            const colorFill = [...typeStyle.color]
            colorFill[3] = 0.5

            const polygonFillStyle = this.map.$createStyle({
              fillColor: colorFill,
            })

            const pointStyle = this.map.$createStyle({
              imageScale: 0.032,
              imageSrc: `/mapmarkers/${typeStyle.name}.svg`,
            })

            this.selectedByHover = f
            this.selectedByHover.setStyle([
              polygonFillStyle,
              highlightStyle,
              pointStyle,
            ])
          }
          return true
        }.bind(this)
      )

      if (hit) {
        this.mapCursor = 'pointer'
      } else {
        this.mapCursor = 'default'
      }
    },
  },
}
</script>

<style lang="postcss" scoped>
.map {
  height: 600px;
}
</style>
