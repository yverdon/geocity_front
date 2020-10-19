<template>
  <div class="py-12 bg-gray-100 mt-4">
    <div class="container mx-auto px-4">
      <SelectField @change="zoomToCoordinates" />
      <ToggleLayers />
      <ToggleGeoLocation @click="setTrackingActive" />

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
          ></vl-view>

          <vl-geoloc
            :tracking="isTrackingActive"
            @update:position="onUpdatePosition"
          >
            <template slot-scope="geoloc">
              <vl-feature
                v-if="geoloc.position && isTrackingActive"
                id="position-feature"
              >
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
          <!-- interactions -->
          <vl-interaction-select
            v-if="drawType == null"
            :features.sync="selectedFeatures"
            ><template slot-scope="select">
              <vl-style-func :factory="selectStyleFuncFactory" />
              <!-- selected feature popup -->
              <vl-overlay
                v-for="feature in select.features"
                :id="feature.id"
                :key="feature.id"
                class="feature-popup"
                :position="clickCoordinate"
                :auto-pan="true"
                :auto-pan-animation="{ duration: 300 }"
                ><template v-if="feature.properties">
                  <section>
                    <header>
                      <a
                        class="red-link"
                        @click="
                          selectedFeatures = selectedFeatures.filter(
                            (f) => f.id !== feature.id
                          )
                        "
                      >
                        X
                      </a>
                      <strong>
                        <p>
                          Événement
                          {{
                            feature.properties.permit_request
                              .administrative_entity.name
                          }}
                        </p>
                      </strong>
                    </header>
                    <div class="card-content">
                      <div class="content">
                        <p>
                          <strong>Début:</strong>
                          {{ feature.properties.starts_at }}<br />
                          <strong>Fin:</strong> {{ feature.properties.ends_at
                          }}<br />
                          <strong>Détails:</strong>
                          {{ feature.properties.comment }}<br />
                          <strong>Plus d'infos:</strong>
                          {{ feature.properties.external_link }}<br />
                          <a href="#">Voir sur le calendrier</a>
                        </p>
                      </div>
                    </div>
                  </section>
                </template>
              </vl-overlay>
              <!--// selected popup -->
            </template>
          </vl-interaction-select>

          <!--// interactions -->
          <vl-layer-tile
            v-for="layer in baseLayers"
            :id="layer.name"
            :key="layer.name"
            :visible="layer.visible"
            ><component
              :is="'vl-source-' + layer.type"
              v-bind="layer"
            ></component>
          </vl-layer-tile>

          <vl-layer-vector id="geocity-vector-layer">
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

      <div class="mt-12">
        <p v-if="loading">Loading features, please wait...</p>
        <p v-if="features.length > 0">
          Loaded features:
          {{
            features.map(
              (feature) =>
                feature.properties.permit_request.administrative_entity.name
            )
          }}
        </p>
        Zoom: {{ zoom }}<br />
        Rotation: {{ rotation }}<br />
      </div>
    </div>
  </div>
</template>

<script>
import layers from '@/components/map/layers.json'

import SelectField from '@/components/atoms/SelectField'
import ToggleLayers from '@/components/map/ToggleLayers'
import ToggleGeoLocation from '@/components/map/ToggleGeoLocation'

export default {
  Name: 'Map',

  compoennts: {
    SelectField,
    ToggleLayers,
    ToggleGeoLocation,
  },

  props: {
    events: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      results: [],
      baseLayers: layers,
      zoom: 8,
      center: [2538236.1400353624, 1180746.4827439308],
      rotation: 0,
      features: [],
      selectedFeatures: [],
      clickCoordinate: undefined,
      loading: false,
      drawType: undefined,
      deviceCoordinate: undefined,
      isTrackingActive: false,
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

    // TODO reuse styleFuncFactory instead of duplicating code ?
    selectStyleFuncFactory() {
      return (feature, resolution) => {
        if (feature.getProperties().permit_request.meta_types.length === 1) {
          const typeStyle = this.$metaTypeStyle[
            feature.getProperties().permit_request.meta_types[0]
          ]

          const genericStyle = this.$createStyle({
            strokeColor: typeStyle.color,
            strokeWidth: 3 + this.$selectStrokeWidth,
            imageColor: typeStyle.color,
            imageFillColor: typeStyle.color,
            imageRadius: this.$circleRadius + this.$selectStrokeWidth,
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

<style>
.feature-popup {
  position: absolute;
  left: -50px;
  bottom: 12px;
  width: 20em;
  max-width: none;
  background-color: white;
  border-radius: 5px;
  padding: 5px;
}
.feature-popup:after,
.feature-popup:before {
  top: 100%;
  border: solid transparent;
  content: ' ';
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.feature-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}
.feature-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}
.card-content {
  max-height: 20em;
  overflow: auto;
}
.content {
  word-break: break-all;
}

.red-link {
  color: red;
  font-weight: bold;
  cursor: pointer;
}
</style>
