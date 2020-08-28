<template>
  <div class="py-12 bg-gray-100">
    <div class="container mx-auto px-4">
      <vl-map data-projection="EPSG:2056" style="height: 400px">
        <vl-view
          :zoom.sync="zoom"
          :center.sync="center"
          :rotation.sync="rotation"
          :projection.sync="projection"
        ></vl-view>

        <vl-layer-tile>
          <vl-source-osm></vl-source-osm>
        </vl-layer-tile>
        <vl-layer-vector>
          <vl-source-vector
            url="http://localhost:9095/rest/events/?starts_at=2020-01-01&ends_at=2020-12-30&adminentity=1"
          ></vl-source-vector>
        </vl-layer-vector>
      </vl-map>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      zoom: 10,
      center: [2538888, 1181125],
      rotation: 0,
      projection: 'EPSG:2056',
    }
  },
}
</script>
