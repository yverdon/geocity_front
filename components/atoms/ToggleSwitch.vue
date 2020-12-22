<template>
  <div class="form-group">
    <ul
      class="flex items-center p-1 border-1 border-solid border-gray-300 bg-negative"
    >
      <li
        v-for="option in defaultOptions"
        :key="option.id"
        class="w-1/2 inline-block relative cursor-pointer"
      >
        <span
          :class="{ 'bg-brand text-negative': option.id === selected }"
          class="flex items-center h-8 rounded cursor-pointer"
        >
          <label :for="option.id" class="w-full text-center cursor-pointer">
            {{ option.value }}
          </label>
        </span>
        <input
          :id="option.id"
          type="radio"
          class="absolute top-0 left-0 right-0 bottom-0 opacity-0"
          :value="option.value"
          :name="group"
          :checked="isChecked(option.id)"
          @click="toggle"
        />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ToggleSwitch',

  props: {
    options: {
      type: Array,
      required: true,
      default: () => [],
    },
    selected: {
      type: String,
      required: false,
      default: '',
    },
    group: {
      type: String,
      required: false,
      default: '',
    },
  },

  data() {
    return {
      defaultOptions: this.options,
    }
  },

  methods: {
    toggle(e) {
      this.$emit('toggle', e.target.id)
    },

    isChecked(option) {
      return option === this.selected
    },
  },
}
</script>
