import Vue from 'vue'
import VueLayers from 'vuelayers'
import 'vuelayers/lib/style.css'
import proj4 from 'proj4'
import { register } from 'ol/proj/proj4'
import { createProj, addProj } from 'vuelayers/lib/ol-ext'

proj4.defs(
  'EPSG:2056',
  '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs'
)
register(proj4)

const swissGrid = createProj({
  code: 'EPSG:2056',
  extent: [2485071.58, 1075346.31, 2828515.82, 1299941.79],
  units: 'm',
})

addProj(swissGrid)

Vue.use(VueLayers, {
  dataProjection: 'EPSG:2056',
})
