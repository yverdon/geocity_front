<template>
  <div class="form-group">
    <button
      class="btn btn--secondary btn--small h-10 focus:outline-none focus:shadow-outline"
      :class="{ 'bg-brand focus:bg-brand': isActive }"
      :disabled="disabled"
      @click="toggle"
    >
      <span class="sr-only">{{ $t('tracking-toggle') }}</span>
      <svg-icon
        name="location"
        class="icon--100 text-negative"
        aria-hidden="true"
      />
    </button>
  </div>
</template>

<script>
export default {
  name: 'ToggleGeoLocation',

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },

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
