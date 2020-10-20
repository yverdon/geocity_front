<template>
  <div class="py-12 bg-gray-100 mt-4">
    <div class="container relative mx-auto px-4">
      <ToggleLayers />

      <section class="flex mb-4">
        <div class="w-1/2">
          <SelectField @change="zoomToCoordinates" />
        </div>
        <div class="w-1/2">
          <ToggleGeoLocation @click="setTrackingActive" />
        </div>
      </section>

      <client-only>
        <vl-map
          :load-tiles-while-animating="true"
          :load-tiles-while-interacting="true"
          class="map"
          @mounted="onMapMounted"
          @click="clickCoordinate = $event.coordinate"
        >
          <vl-view
            :zoom.sync="zoom"
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
                    src="/mapmarkers/forms_geolocation.svg"
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
          <LayerVector
            :features="features"
            :factory="styleFuncFactory"
            @update="onFeaturesUpdate(map)"
            @mounted="onSourceVectorMounted(map)"
          />
        </vl-map>
      </client-only>
    </div>
  </div>
</template>

<script>
import layers from '@/components/map/layers.json'

import SelectField from '@/components/atoms/SelectField'
import ToggleLayers from '@/components/map/ToggleLayers'
import ToggleGeoLocation from '@/components/map/ToggleGeoLocation'
import Popover from '@/components/map/Popover'
import LayerTile from '@/components/map/LayerTile'
import LayerVector from '@/components/map/LayerVector'

export default {
  Name: 'Map',

  compoennts: {
    SelectField,
    ToggleLayers,
    ToggleGeoLocation,
    Popover,
    LayerTile,
    LayerVector,
  },

  props: {
    events: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      baseLayers: layers,
      zoom: 8,
      rotation: 0,
      center: [2538236.1400353624, 1180746.4827439308],
      isTrackingActive: false,

      map: [],
      features: [],
      selectedFeature: [],
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
     * Add controls fullscreen & assign instance to map data.
     */
    onMapMounted(map) {
      map.$createPromise.then(() => {
        map.$map.addControl(this.$FullScreen)
        this.map = map
      })
    },

    /**
     * On Feature Update
     */
    onFeaturesUpdate(map) {
      if (map.$eventVectorSource) {
        this.map.getView(map.$eventVectorSource.getExtent(), {
          padding: map.$fitViewPadding,
        })
      }
    },

    /**
     * On Source Vector Mounted
     * Assign to map data the event vector source.
     */
    onSourceVectorMounted(map) {
      this.map.$eventVectorSource = map.$source
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
        this.zoom = 10
      } else {
        this.center = [2538236.1400353624, 1180746.4827439308]
        this.zoom = 8
      }
    },

    /**
     * Style Function Factory
     */
    styleFuncFactory() {
      return (feature, resolution) => {
        if (feature.getProperties().permit_request.meta_types.length === 1) {
          const typeStyle = this.$metaTypeStyle[
            feature.getProperties().permit_request.meta_types[0]
          ]

          const genericStyle = this.$createStyle({
            strokeColor: typeStyle.color,
            strokeWidth: 3,
            imageColor: typeStyle.color,
            imageFillColor: typeStyle.color,
            imageRadius: this.$circleRadius,
            imageOpacity: 1,
          })

          const colorFill = [...typeStyle.color]
          colorFill[3] = this.$fillOpacity

          const polygonFillStyle = this.$createStyle({
            fillColor: colorFill,
          })

          const pointStyle = this.$createStyle({
            imageScale: this.$symbolScale,
            imageSrc: typeStyle.symbol,
          })

          return [polygonFillStyle, genericStyle, pointStyle]
        }
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
