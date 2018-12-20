<template>
  <section class="container">
    <div>
      <logo/>
      <h1 class="title">
        index.vue
      </h1>
      <!--
      <CitySelect
        :value="fixSelected"
        :cities="cities"
        :input="selected = $event"
      />
      -->
      <select v-model="selected">
        <option
          v-for="(value, key) in cities"
          :key="key">
          {{ key }}
        </option>
      </select>

      <p>{{ name }}</p>
      <div v-if="name">
        <nuxt-child/>

        <Daylight
          :lat="getLat"
          :long="getLong"
          preferstart="17:00"
          preferend="19:00"
        />

      </div>
    </div>
  </section>
</template>

<script>
import Logo from '~/components/Logo.vue'
import Daylight from '~/components/Daylight.vue'
import _ from 'lodash'
import { timeOverlap } from '~/extras/Helpers.js'

export default {
  components: {
    Logo,
    Daylight
  },
  data() {
    return {
      name: 'default',
      selected: '',
      cities: {}
    }
  },
  async asyncData({ $axios, params }) {
    // called every time before loading the component
    // as the name said, it can be async
    // Also, the returned object will be merged with your data object
    try {
      let outName = _.upperFirst(params.name)

      return $axios.$get(`/cities.json`).then(res => {
        return {
          name: outName,
          selected: outName,
          cities: res
        }
      })
    } catch (e) {
      return {
        name: 'error'
      }
    }
  },
  computed: {
    fixSelected: function() {
      const instring = this.selected || ''
      return instring.charAt(0).toUpperCase() + instring.slice(1)
    },
    getLat: function() {
      if (this.selected in this.cities) {
        return this.cities[this.selected][0]
      }
      return 60
    },
    getLong: function() {
      if (this.selected in this.cities) {
        return this.cities[this.selected][1]
      }
      return 18
    }
  },
  watch: {
    selected() {
      console.log('selected changed')
    }
  },
  methods: {}
}
</script>

<style>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
