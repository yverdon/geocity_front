<template>
  <section>
    <vl-layer-tile
      v-for="layer in layers"
      :id="layer.name"
      :key="layer.name"
      :visible="layer.visible"
    >
      <component :is="'vl-source-' + layer.type" v-bind="layer"></component>
    </vl-layer-tile>
  </section>
</template>

<script>
export default {
  name: 'LayerTile',

  props: {
    layers: {
      type: Array,
      required: true,
    },
  },
}
</script>
