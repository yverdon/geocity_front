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
            v-on:click="zoomToCoordinates(result.attrs.y, result.attrs.x)"
          >
            <pre>{{ result.attrs.label }}</pre>
          </li>
        </ul>
      </div>

      <!-- base layers switch -->
      <div class="base-layers-panel">
        <div class="buttons has-addons">
          <button
            v-for="layer in baseLayers"
            :key="layer.name"
            class="button is-light"
            :class="{ 'is-info': layer.visible }"
            @click="showBaseLayer(layer.name)"
          >
            {{ layer.title }}
          </button>
        </div>
      </div>
      <!--// base layers -->
      <client-only>
        <vl-map
          :load-tiles-while-animating="true"
          :load-tiles-while-interacting="true"
          style="height: 400px"
        >
          <vl-view
            :zoom.sync="zoom"
            :center.sync="center"
            :rotation.sync="rotation"
          ></vl-view>

          <vl-geoloc @update:position="onUpdatePosition">
            <template slot-scope="geoloc">
              <vl-feature v-if="geoloc.position" id="position-feature">
                <vl-geom-point :coordinates="geoloc.position"></vl-geom-point>
                <vl-style-box>
                  <vl-style-circle :radius="10">
                    <vl-style-fill color="white"></vl-style-fill>
                    <vl-style-stroke color="red"></vl-style-stroke>
                  </vl-style-circle>
                </vl-style-box>
              </vl-feature>
            </template>
          </vl-geoloc>
          <!-- interactions -->
          <vl-interaction-select
            v-if="drawType == null"
            :features.sync="selectedFeatures"
            ><template slot-scope="select">
              <!-- select styles -->
              <vl-style-box>
                <vl-style-stroke color="#423e9e" :width="7"></vl-style-stroke>
                <vl-style-fill :color="[254, 178, 76, 0.7]"></vl-style-fill>
                <vl-style-circle :radius="5">
                  <vl-style-stroke color="#423e9e" :width="7"></vl-style-stroke>
                  <vl-style-fill :color="[254, 178, 76, 0.7]"></vl-style-fill>
                </vl-style-circle>
              </vl-style-box>
              <vl-style-box :z-index="1">
                <vl-style-stroke color="#d43f45" :width="2"></vl-style-stroke>
                <vl-style-circle :radius="5">
                  <vl-style-stroke color="#d43f45" :width="2"></vl-style-stroke>
                </vl-style-circle>
              </vl-style-box>
              <!--// select styles -->
              <!-- selected feature popup -->
              <vl-overlay
                v-for="feature in select.features"
                :id="feature.id"
                :key="feature.id"
                class="feature-popup"
                :position="pointOnSurface(feature.geometry)"
                :auto-pan="true"
                :auto-pan-animation="{ duration: 300 }"
                ><template>
                  <section class="card">
                    <header class="card-header">
                      <strong>
                        <p class="card-header-title">
                          Événement
                          {{
                            feature.properties.permit_request
                              .administrative_entity.name
                          }}
                        </p>
                        <a
                          class="card-header-icon"
                          title="Close"
                          @click="
                            selectedFeatures = selectedFeatures.filter(
                              (f) => f.id !== feature.id
                            )
                          "
                          ><b-icon icon="close"></b-icon>
                        </a>
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
              :is="'vl-source-' + layer.name"
              v-bind="layer"
            ></component>
          </vl-layer-tile>
          <vl-layer-vector>
            <vl-source-vector :features.sync="features"></vl-source-vector>
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
        Center: {{ center }}<br />
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
      zoom: 13,
      center: [2538236.1400353624, 1180746.4827439308],
      rotation: 0,
      features: [],
      selectedFeatures: [],
      loading: false,
      drawType: undefined,
      deviceCoordinate: undefined,
      baseLayers: [
        {
          name: 'osm',
          title: 'OpenStreetMap',
          visible: true,
        },
        {
          name: 'sputnik',
          title: ' - Sputnik Maps',
          visible: false,
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

    onUpdatePosition(coordinate) {
      this.deviceCoordinate = coordinate
    },
    zoomToCoordinates(east, north) {
      this.center = [east, north]
      this.zoom = 13
      this.isSearchResultOpen = false
    },
    pointOnSurface(geom) {
      return geom.geometries[0].coordinates[0] // Replace by centroid or mouse position
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
</style>
