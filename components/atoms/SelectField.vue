<template>
  <div class="form-group">
    <client-only>
      <v-select
        v-model="selected"
        class="select-field"
        :options="options"
        :disabled="disabled"
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
  name: 'SelectField',

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
    disabled: {
      type: Boolean,
      default: false,
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
.select-field.v-select {
  @apply p-0;
  border: none;
}

.select-field .vs__selected {
  @apply text-brand;
}

.select-field .vs__dropdown-toggle {
  min-height: 40px;
  @apply bg-negative border-gray-300;
  border-radius: 0 !important;
}

.select-field.vs--disabled .vs__dropdown-toggle {
  @apply opacity-50;
}

.select-field.vs--disabled .vs__search {
  @apply bg-negative;
}
</style>
