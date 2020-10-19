<template>
  <div>
    <button class="p-2 leading-none" @click="toggle">
      <svg-icon
        name="location"
        :class="{ 'text-brand-dark': isActive }"
        class="icon--100 text-brand"
      />
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
