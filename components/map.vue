<template>
  <div class="py-12 bg-gray-100">
    <div class="container mx-auto px-4">
      <div>
        Où ?
        <input v-model="search" type="text" @input="fetchResults" />
        <p v-if="isLoading">Loading datas</p>
        <ul v-else v-show="isSearchResultOpen">
          <li
            v-for="result in results"
            :key="result.id"
            @click="zoomToCoordinates(result.attrs.y, result.attrs.x)"
          >
            <pre>{{ result.attrs.label }}</pre>
          </li>
        </ul>
      </div>
      <div>
        <div>
          <button
            v-for="layer in baseLayers"
            :key="layer.name"
            :class="{ 'is-info': layer.visible }"
            @click="showBaseLayer(layer.name)"
          >
            {{ layer.title }}
          </button>
        </div>
      </div>
      <div>
        <div>
          <button @click="setTrackingActive">Activer la localisation</button>
          <button @click="isTrackingActive = false">
            Désactiver la localisation
          </button>
        </div>
      </div>
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
export default {
  Name: 'Map',

  props: {
    events: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      results: [],
      search: '',
      isSearchResultOpen: false,
      searchBBOX: '2533863,1176363,2541963,1186738', // Get the administrative_entity extent from geocity API
      isLoading: false,
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
      // TODO: get this from config file
      baseLayers: [
        {
          name: 'Sputnik Maps -',
          type: 'sputnik',
          title: 'Sputnik Maps -',
          visible: false,
        },
        {
          name: 'asit-vd-1',
          type: 'wmts',
          title: ' Cadastre',
          visible: true,
          layerName: 'asitvd.fond_cadastral',
          matrixSet: '2056',
          style: 'default',
          url: 'https://ows.asitvd.ch/wmts/',
          origin: [2420000, 1350000],
          format: 'image/png',
          projection: 'EPSG:2056',
          styleName: 'default',
          resolutions: [
            4000,
            3750,
            3500,
            3250,
            3000,
            2750,
            2500,
            2250,
            2000,
            1750,
            1500,
            1250,
            1000,
            750,
            650,
            500,
            250,
            100,
            50,
            20,
            10,
            5,
            2.5,
            2,
            1.5,
            1,
            0.5,
            0.25,
            0.1,
            0.05,
          ],
          matrixIds: [
            '0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18',
            '19',
            '20',
            '21',
            '22',
            '23',
            '24',
            '25',
            '26',
            '27',
            '28',
            '29',
          ],
          attributions: ['© OIT, OSM'],
        },
        {
          name: 'swisstopo-1',
          type: 'wmts',
          requestEncoding: 'REST',
          title: ' - Swissimage',
          visible: false,
          layerName: 'ch.swisstopo.swissimage',
          matrixSet: '2056',
          style: 'default',
          url:
            'https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.swissimage/default/current/2056/{TileMatrix}/{TileCol}/{TileRow}.jpeg',
          origin: [2420000, 1350000],
          format: 'image/jpeg',
          projection: 'EPSG:2056',
          styleName: 'default',
          resolutions: [
            4000,
            3750,
            3500,
            3250,
            3000,
            2750,
            2500,
            2250,
            2000,
            1750,
            1500,
            1250,
            1000,
            750,
            650,
            500,
            250,
            100,
            50,
            20,
            10,
            5,
            2.5,
            2,
            1.5,
            1,
            0.5,
            0.25,
            0.1,
            0.05,
          ],
          matrixIds: [
            '0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18',
            '19',
            '20',
            '21',
            '22',
            '23',
            '24',
            '25',
            '26',
            '27',
            '28',
          ],
          attributions: ['© Données:swisstopo'],
        },
      ],
    }
  },

  mounted() {
    this.features = this.events.features
  },

  methods: {
    async fetchResults() {
      if (this.search.length <= 2) {
        this.results = []
        this.isSearchResultOpen = false
        return
      }
      const data = await this.$axios.$get(
        `https://api3.geo.admin.ch/rest/services/api/SearchServer?limit=20&partitionlimit=24&type=locations&sr=2056&lang=fr&origins=address&searchText=${this.search}&bbox=${this.searchBBOX}`
      )
      this.results = data.results
      this.isSearchResultOpen = true
    },
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
    setTrackingActive() {
      this.isTrackingActive = true
      if (this.deviceCoordinate) {
        this.$olMap.getView().setCenter(this.deviceCoordinate)
      }
    },
    zoomToCoordinates(east, north) {
      this.center = [east, north]
      this.zoom = 10
      this.isSearchResultOpen = false
    },
    showBaseLayer(name) {
      let layer = this.baseLayers.find((layer) => layer.visible)
      if (layer != null) {
        layer.visible = false
      }
      layer = this.baseLayers.find((layer) => layer.name === name)
      if (layer != null) {
        layer.visible = true
      }
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
