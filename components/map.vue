<template>
  <div class="py-12 bg-gray-100">
    <div class="container mx-auto px-4">
      <client-only>
        <vl-map
          :load-tiles-while-animating="true"
          :load-tiles-while-interacting="true"
          data-projection="EPSG:4326"
          style="height: 400px"
        >
          <vl-view
            :zoom.sync="zoom"
            :center.sync="center"
            :rotation.sync="rotation"
          ></vl-view>

          <vl-layer-tile>
            <vl-source-osm></vl-source-osm>
          </vl-layer-tile>

          <vl-layer-vector>
            <vl-source-vector :features.sync="features"></vl-source-vector>

            <vl-style-box>
              <vl-style-stroke color="green" :width="3"></vl-style-stroke>
              <vl-style-fill color="rgba(255,255,255,0.5)"></vl-style-fill>
            </vl-style-box>
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
      <pre>{{ events.features }}</pre>
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
      zoom: 2,
      center: [2538236.1400353624, 1180746.4827439308],
      rotation: 0,
      features: [],
      loading: false,
    }
  },

  mounted() {
    this.features = this.events.features
  },
}
</script>
