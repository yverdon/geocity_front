<template>
  <div class="mt-12 py-12 bg-gray-100">
    <div class="container mx-auto px-4">
      <h2>{{ $t('events') }}</h2>
      <div class="autocomplete">
        Où ?
        <input
          v-model="search"
          type="text"
          @input="onChange"
          @keydown.down="onArrowDown"
          @keydown.up="onArrowUp"
          @keydown.enter="onEnter"
        />
        <ul
          v-show="isOpen"
          id="autocomplete-results"
          class="autocomplete-results"
        >
          <li>
            {{ results.map((result) => result) }}
          </li>
          <li v-if="isLoading" class="loading">Loading results...</li>
          <li
            v-for="(result, i) in results"
            v-else
            :key="i"
            class="autocomplete-result"
            :class="{ 'is-active': i === arrowCounter }"
            @click="setResult(result)"
          >
            toto
            {{ result }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AutoComplete',

  data() {
    return {
      isOpen: false,
      results: [],
      search: '',
      isLoading: false,
      arrowCounter: 0,
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },
  destroyed() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    onChange() {
      this.isLoading = true
      axios
        .get(
          'https://api3.geo.admin.ch/rest/services/api/SearchServer?limit=20&partitionlimit=24&type=locations&sr=2056&lang=fr&origins=address&searchText=' +
            this.search
        )
        .then(function (response) {
          return { results: response.data}
        })
      this.isOpen = true
    },
    setResult(result) {
      this.search = result
      this.isOpen = false
    },
    onArrowDown(evt) {
      if (this.arrowCounter < this.results.length) {
        this.arrowCounter = this.arrowCounter + 1
      }
    },
    onArrowUp() {
      if (this.arrowCounter > 0) {
        this.arrowCounter = this.arrowCounter - 1
      }
    },
    onEnter() {
      this.search = this.results[this.arrowCounter]
      this.isOpen = false
      this.arrowCounter = -1
    },
    handleClickOutside(evt) {
      if (!this.$el.contains(evt.target)) {
        this.isOpen = false
        this.arrowCounter = -1
      }
    },
  },
}
</script>

<style>
.autocomplete {
  position: relative;
}

.autocomplete-results {
  padding: 0;
  margin: 0;
  border: 1px solid #eeeeee;
  height: 120px;
  overflow: auto;
  width: 100%;
  background-color: white;
  opacity: 0.8;
}

.autocomplete-result {
  list-style: none;
  text-align: left;
  padding: 4px 2px;
  cursor: pointer;
}

.autocomplete-result.is-active,
.autocomplete-result:hover {
  background-color: #4aae9b;
  color: white;
}
</style>
