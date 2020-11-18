<template>
  <div class="form-group">
    <button
      class="btn btn--secondary btn--small h-10 focus:outline-none focus:shadow-outline"
      :class="{ 'bg-brand focus:bg-brand': isActive }"
      @click="toggle"
    >
      <svg-icon name="location" class="icon--100 text-negative" />
    </button>
  </div>
</template>

<script>
export default {
  name: 'ToggleGeoLocation',

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
