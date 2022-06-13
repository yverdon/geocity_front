<template>
  <div class="container relative mx-auto px-4">
    <div class="mx-1">
      <vl-map
        :load-tiles-while-animating="true"
        :load-tiles-while-interacting="true"
        :class="{ 'cursor-pointer': mapCursor }"
        class="map"
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

        <vl-interaction-select @select="handleEventClick">
          <vl-style-func :factory="styleFuncFactory" />
        </vl-interaction-select>

        <LayerTile :layers="baseLayers" />
        <LayerVector :features="features" :factory="styleFuncFactory" />
      </vl-map>

      <ToggleLayers />
    </div>

    <Modal :name="'map-modal'" :content="modalContent" />
  </div>
</template>

<script>
import { areIntervalsOverlapping } from 'date-fns'

import layers from '@/components/map/layers.json'
import { pointer, fill, mapMarker } from '@/components/map/helpers/styles'

import Modal from '@/components/atoms/Modal'

import ToggleLayers from '@/components/map/ToggleLayers'
import LayerTile from '@/components/map/LayerTile'
import LayerVector from '@/components/map/LayerVector'

export default {
  Name: 'Map',

  components: {
    Modal,
    ToggleLayers,
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
      mapCursor: false,
      featureHover: null,

      map: [],
      features: [],
      clickCoordinate: [],
      deviceCoordinate: [],
      modalContent: {},
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
      this.isTrackingActive = isActive

      if (!isActive) {
        this.deviceCoordinate = []
      }

      if (this.deviceCoordinate.length > 0) {
        this.center = this.deviceCoordinate
      } else {
        // As there is no location the zoom will be reset
        this.zoomToCoordinates()
      }
    },

    /**
     * Zoom To Coordinate
     * @param {Array} location
     * Set the center to location values else set to default
     * value centred on Yverdon-Les-Bains.
     */
    zoomToCoordinates(location) {
      if (location) {
        this.center = [location.attrs.y, location.attrs.x]
        this.zoomDefault = 12
      } else {
        this.center = [2538236.1400353624, 1180746.4827439308]
        this.zoomDefault = 8
      }
    },

    /**
     * Filter Features
     * @param {Object} query
     * Get the query search selected thought the `Strainer` component and
     * filter the data `features` Object to pass down the filtred `features`
     * to the `LayerVector` component.
     */
    filterFeatures(query) {
      this.features = this.events.features.filter((feature) => {
        const featureStartDate = new Date(feature.properties.starts_at)
        const featureEndDate = new Date(feature.properties.ends_at)

        if (query.type.length) {
          return (
            feature.properties.permit_request.meta_types[0] === query.type[0] &&
            this.dateIntervalFilter({
              queryDates: [query.dates[0], query.dates[1]],
              featureDates: [featureStartDate, featureEndDate],
            })
          )
        } else {
          return this.dateIntervalFilter({
            queryDates: [query.dates[0], query.dates[1]],
            featureDates: [featureStartDate, featureEndDate],
          })
        }
      })
    },

    /**
     * Date Interval Filter
     * @param {Object} dates
     * @return {Array}
     *
     * Return date range that overlap the event range date
     * There is mutlitple possibility as shown below :
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
    dateIntervalFilter(dates) {
      return areIntervalsOverlapping(
        { start: dates.queryDates[0], end: dates.queryDates[1] },
        { start: dates.featureDates[0], end: dates.featureDates[1] }
      )
    },

    /**
     * Style Function Factory
     * Return styled Map Markers for each type of event
     */
    styleFuncFactory() {
      return (feature) => {
        let typeStyle = this.events.type[0]
        if (feature.getProperties().permit_request.meta_types) {
          /* Specific style is only applied when on single meta_type is defined */
          if (feature.getProperties().permit_request.meta_types.length === 1) {
            typeStyle =
              this.events.type[
                feature.getProperties().permit_request.meta_types[0]
              ]
          }
          const genericStyle = this.map.$createStyle(pointer(typeStyle))
          const polygonFillStyle = this.map.$createStyle({
            fillColor: fill(typeStyle),
          })
          const markers = this.map.$createStyle(mapMarker(typeStyle))
          return [polygonFillStyle, genericStyle, markers]
        } else {
          const genericStyle = this.map.$createStyle(pointer(typeStyle))
          const polygonFillStyle = this.map.$createStyle({
            fillColor: fill(typeStyle),
          })
          const markers = this.map.$createStyle(mapMarker(typeStyle))
          return [polygonFillStyle, genericStyle, markers]
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
      this.map.forEachFeatureAtPixel(pixel, () => (this.mapCursor = true))

      if (this.featureHover !== null) {
        this.featureHover.setStyle(undefined)
        this.featureHover = null
      }

      this.map.forEachFeatureAtPixel(
        pixel,
        function (feature) {
          if (feature.getProperties().permit_request.meta_types) {
            let typeStyle = this.events.type[0]
            if (
              feature.getProperties().permit_request.meta_types.length === 1
            ) {
              typeStyle =
                this.events.type[
                  feature.getProperties().permit_request.meta_types[0]
                ]
            }

            const hoverStyle = this.map.$createStyle(pointer(typeStyle, true))
            const polygonFillStyle = this.map.$createStyle({
              fillColor: fill(typeStyle, true),
            })
            const markers = this.map.$createStyle(mapMarker(typeStyle, true))

            this.featureHover = feature
            this.featureHover.setStyle([polygonFillStyle, hoverStyle, markers])
          }
          return true
        }.bind(this)
      )
    },

    async handleEventClick(feature) {
      let permitsDetails = {}
      permitsDetails = await this.$store.dispatch(
        'getPermitsDetails',
        feature.values_.permit_request.id
      )

      this.modalContent = {
        title:
          feature.values_.permit_request.shortname === ''
            ? feature.values_.permit_request.administrative_entity.name
            : feature.values_.permit_request.shortname,
        comment: feature.values_.comment,
        link: feature.values_.external_link,
        start: feature.values_.starts_at,
        end: feature.values_.ends_at,
        permitsDetails: permitsDetails ? permitsDetails.wot_properties : {},
      }

      this.$modal.show('map-modal')
    },
  },
}
</script>

<style lang="postcss" scoped>
.map {
  height: 600px;
}
</style>
