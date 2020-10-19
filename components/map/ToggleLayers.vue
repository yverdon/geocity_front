<template>
  <section class="absolute bottom-0 z-10 control">
    <button
      v-for="layer in baseLayers"
      :key="layer.name"
      :class="{ 'is-active': layer.visible }"
      class="btn btn--small btn--map"
      @click="toggle(layer.name)"
    >
      {{ layer.title }}
    </button>
  </section>
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
    toggle(name) {
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

<style lang="postcss" scoped>
section {
  @apply rounded-md p-1;
  margin-left: 0.5em;
  margin-bottom: 0.5em;
  background-color: rgba(255, 255, 255, 0.4);
}

.btn--map {
  @apply outline-none text-negative border-none;
  background-color: rgba(0, 60, 136, 0.5);
}

.is-active {
  background-color: rgba(0, 60, 136);
}
</style>
