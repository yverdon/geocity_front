<template>
  <div class="form-group">
    <label :for="id" class="form-group__label h-8">{{ label }}</label>
    <div class="flex">
      <flat-pickr
        :id="id"
        v-model="dates"
        :config="config"
        :class="{ 'cursor-not-allowed': disabled }"
        :disabled="disabled ? true : false"
        class="form-group__input h-10 flex-grow"
        @on-change="$emit('change', $event)"
      />
      <button
        class="btn btn--secondary btn--small h-10 w-10 focus:outline-none focus:shadow-outline ml-2"
        :disabled="disabled ? true : false"
        data-clear
      >
        <span class="sr-only">{{ $t('clear-date-selection') }}</span>
        <svg-icon
          name="close"
          class="icon--75 text-negative"
          aria-hidden="true"
        />
      </button>
    </div>
  </div>
</template>

<script>
import { French } from 'flatpickr/dist/l10n/fr.js'

export default {
  name: 'DatePicker',

  props: {
    id: {
      type: String,
      default: '',
      required: false,
    },
    label: {
      type: String,
      default: '',
      required: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      dates: [],
      config: {
        wrap: true,
        mode: 'range',
        dateFormat: 'd.m.Y',
        locale: French,
      },
    }
  },
}
</script>
