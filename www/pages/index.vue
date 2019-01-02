<template>
  <section class="container">
    <div>
      <p>
        <nuxt-link to="/Stockholm">Stockholm</nuxt-link>
        <nuxt-link to="/Malmö">Malmö</nuxt-link>
        <nuxt-link to="/Piteå">Piteå</nuxt-link>
      </p>

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
          :points-sun="pointsSun"
          :points-dawn-dusk="pointsDawnDusk"
          preferstart="21:00"
          preferend="23:00"
        />

      </div>
    </div>
  </section>
</template>

<script>
import Daylight from '~/components/Daylight.vue'
import _ from 'lodash'
import { timeOverlap } from '~/extras/Helpers.js'

export default {
  components: {
    Daylight
  },
  data() {
    return {
      name: 'default',
      selected: '',
      cities: {},
      pointsSun: 5,
      pointsDawnDusk: 1
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
      console.warn(this.params)
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
    },
    $route(to, from) {
      console.log(to)
      console.log(from)
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
