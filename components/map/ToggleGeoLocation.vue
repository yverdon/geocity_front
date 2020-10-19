<template>
  <div>
    <button class="btn btn--primary" @click="toggle">
      <svg-icon name="location" class="icon--75" />
    </button>
  </div>
</template>

<script>
export default {
  name: 'ToggleGeoLocation',

  components: {},

  data() {
    return {
      isActive: false,
    }
  },

  methods: {
    toggle() {
      this.isActive = !this.isActive
      this.$emit('click', this.isActive)
    },
  },
}
</script>
