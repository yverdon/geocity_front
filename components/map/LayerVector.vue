<template>
  <vl-layer-vector>
    <vl-source-vector :features.sync="defaultFeature">
      <vl-style-func :factory="factory" />
    </vl-source-vector>
  </vl-layer-vector>
</template>

<script>
export default {
  name: 'LayerVector',

  props: {
    features: {
      type: Array,
      required: true,
    },
    factory: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      defaultFeature: this.features,
    }
  },

  watch: {
    // eslint-disable-next-line object-shorthand
    features: function (filterdFeatures) {
      this.defaultFeature = filterdFeatures
    },
  },
}
</script>
