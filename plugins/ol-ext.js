import Vue from 'vue'
import proj4 from 'proj4'
import { register } from 'ol/proj/proj4'
import { createProj, addProj, createStyle } from 'vuelayers/lib/ol-ext'

import FullScreen from 'ol/control/FullScreen'

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

Vue.prototype.$createStyle = createStyle

Vue.prototype.$FullScreen = new FullScreen()

Vue.prototype.$olMap = {}
Vue.prototype.$eventVectorSource = {}

// TODO: get all following parameters from config file
Vue.prototype.$metaTypeStyle = {
  0: { symbol: '/mapmarkers/question-mark.svg', color: [0, 140, 111, 1] }, // meta_type = 0 => default value if multiple meta_type
  1: { symbol: '/mapmarkers/construction.svg', color: [201, 2, 25, 1] },
  2: { symbol: '/mapmarkers/cone.svg', color: [255, 166, 0, 1] },
  3: { symbol: '/mapmarkers/sport.svg', color: [39, 115, 230, 1] },
  4: { symbol: '/mapmarkers/culture.svg', color: [27, 76, 150, 1] },
  5: { symbol: '/mapmarkers/commercial.svg', color: [14, 36, 69, 1] },
  6: { symbol: '/mapmarkers/police.svg', color: [4, 0, 255, 1] },
}

Vue.prototype.$fillOpacity = 0.5
Vue.prototype.$symbolScale = 0.025
Vue.prototype.$circleRadius = 14
Vue.prototype.$selectStrokeWidth = 2
Vue.prototype.$fitViewPadding = [1000, 1000, 1000, 1000] // in pixels
