<template>
  <div class="form-group">
    <label :for="id" class="form-group__label">{{ label }}</label>
    <client-only>
      <flat-pickr
        :id="id"
        v-model="dates"
        :config="config"
        class="form-group__input"
      />
    </client-only>
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
  },

  data() {
    return {
      dates: '',
      config: {
        mode: 'range',
        dateFormat: 'd.m.Y',
        locale: French,
      },
    }
  },
}
</script>
