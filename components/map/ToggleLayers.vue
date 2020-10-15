<template>
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
</template>

<script>
import layers from '@/components/map/layers.json'

export default {
  name: 'ToggleLayers',

  data() {
    return {
      baseLayers: layers,
    }
  },

  methods: {
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
