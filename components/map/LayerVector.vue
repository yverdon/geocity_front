<template>
  <vl-layer-vector>
    <vl-source-vector :features.sync="feat">
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
      feat: this.features,
    }
  },
}
</script>
