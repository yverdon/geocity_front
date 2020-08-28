<template>
  <div class="py-12 bg-gray-100">
    <div class="container mx-auto px-4">
      <vl-map data-projection="EPSG:2056" style="height: 400px">
        <vl-view
          :zoom.sync="zoom"
          :center.sync="center"
          :rotation.sync="rotation"
        ></vl-view>

        <vl-layer-tile>
          <vl-source-osm></vl-source-osm>
        </vl-layer-tile>

        <vl-feature>
          <vl-geom-point :coordinates="[38.726634, 9.003391]"></vl-geom-point>
        </vl-feature>
      </vl-map>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      zoom: 15,
      center: [2538888, 1181125],
      rotation: 0,
    }
  },
}
</script>
