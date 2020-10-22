<template>
  <div class="form-group mt-8">
    <ul
      class="flex items-center mx-1 p-1 border-1 border-solid border-gray-300 bg-negative"
    >
      <li
        v-for="option in defaultOptions"
        :key="option"
        class="w-1/2 inline-block relative cursor-pointer"
      >
        <span
          :class="{ 'bg-brand text-negative': option === defaultSelected }"
          class="flex items-center h-8 rounded cursor-pointer"
        >
          <label :for="option" class="w-full text-center cursor-pointer">
            {{ option }}
          </label>
        </span>
        <input
          :id="option"
          type="radio"
          class="absolute top-0 left-0 right-0 bottom-0 opacity-0"
          :value="option"
          :name="group"
          :checked="isChecked(option)"
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
      defaultSelected: this.selected,
    }
  },

  methods: {
    toggle(e) {
      this.defaultSelected = e.target.id
      this.$emit('toggle', e.target.id)
    },

    isChecked(option) {
      return option === this.defaultSelected
    },
  },
}
</script>
