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
          style="height: 500px"
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

          <vl-layer-vector>
            <vl-source-vector
              :features.sync="features"
              @update:features="onFeaturesUpdate"
              @mounted="onSourceMounted"
            >
              <vl-style-func :factory="styleFuncFactory" />
            </vl-source-vector>
          </vl-layer-vector>
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

export default {
  Name: 'Map',

  compoennts: {
    SelectField,
    ToggleLayers,
    ToggleGeoLocation,
    Popover,
    LayerTile,
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
      features: [],
      selectedFeature: [],
      clickCoordinate: undefined,
      deviceCoordinate: undefined,
    }
  },

  mounted() {
    this.features = this.events.features
  },

  methods: {
    onMapMounted(vuemap) {
      vuemap.$createPromise.then(() => {
        vuemap.$map.addControl(this.$FullScreen)
        this.$olMap = vuemap
      })
    },

    onSourceMounted(vuemap) {
      this.$eventVectorSource = vuemap.$source
    },

    onFeaturesUpdate() {
      this.$olMap.getView(this.$eventVectorSource.getExtent(), {
        padding: this.$fitViewPadding,
      })
    },

    onUpdatePosition(coordinate) {
      this.deviceCoordinate = coordinate
      this.$olMap.getView().setCenter(coordinate)
    },

    setTrackingActive(isActive) {
      this.isTrackingActive = isActive

      if (this.deviceCoordinate) {
        this.$olMap.getView().setCenter(this.deviceCoordinate)
      }
    },

    zoomToCoordinates(location) {
      this.center = [location.attrs.y, location.attrs.x]
      this.zoom = 10
    },

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
