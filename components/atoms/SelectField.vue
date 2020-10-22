<template>
  <div class="form-group">
    <client-only>
      <v-select
        v-model="selected"
        class="form-group__input"
        :options="options"
        @input="$emit('change', selected)"
      >
        <template #header>
          <div class="form-group__label h-8">
            {{ header }}
          </div>
        </template>

        <span slot="no-options">{{ $t('select-no-option') }}</span>

        <template #option="{ label }">
          <span>{{ label }}</span>
        </template>
      </v-select>
    </client-only>
  </div>
</template>

<script>
export default {
  Name: 'SelectField',

  props: {
    header: {
      type: String,
      default: '',
      required: false,
    },
    options: {
      type: Array,
      default: () => [],
      required: true,
    },
    default: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      selected: this.default,
    }
  },
}
</script>

<style lang="postcss">
.form-group__input.v-select {
  @apply p-0;
  border: none;
}

.form-group__input .vs__selected {
  @apply text-brand;
}

.form-group__input .vs__dropdown-toggle {
  height: 40px;
  @apply bg-negative border-gray-300;
  border-radius: 0 !important;
}
</style>
