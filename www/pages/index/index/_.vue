<template>
  <div>
    <!--
    <h1>/index/index/_.vue</h1>
    <h2>{{ currentPage }}</h2>
    <h2>{{ ok }}</h2>
    <p>City: {{ city }}</p>
    <p>Start: {{ timeStart }}</p>
    <p>End: {{ timeEnd }}</p>
    -->
    <main>
      <div class="e-h1">
        <h1>Vad är bäst i <span
          v-if="!showSearch"
          @click="focusSearch"
        >{{ city }}</span></h1>
        <div
          :class="{ sActive: showSearch }"
          class="e-vSelect"
        >
          <no-ssr>
            <v-select
              ref="mySelect"
              v-model="city"
              :options="citiesArray"

              placeholder="Välj stad"
              @change="navigate"
            />
          </no-ssr>
        </div>
      </div>

      <Timeselector
        :time-selected="timeSelected"
        :time-selection="timeSelection"
        @setTimeselect="setTimeSelect"
      />



      <section v-if="showResult">
        <Daylight
          :lat="getLat"
          :long="getLong"
          :preferstart="timeStart"
          :preferend="timeEnd"
        />
        <!--
        Todo: add           :points-sun="pointsSun"
          :points-dawn-dusk="pointsDawnDusk"
        -->
      </section>

    </main>

  </div>
</template>

<script>
import Daylight from '~/components/Daylight.vue'
import Timeselector from '~/components/Timeselector.vue'

export default {
  name: 'FullPage',
  head() {
    const basetitle = 'Vad är bäst? ☀️ Sommartid eller ❄️ Vintertid'
    if (this.city === '') {
      return {
        title: basetitle + ' (normaltid)'
      }
    }
    return {
      title:
        basetitle +
        ' i ' +
        this.city +
        ' (ljust ' +
        this.timeSelected.name +
        ')'
    }
  },
  components: {
    Daylight,
    Timeselector
  },
  data() {
    return {
      showSearch: true,
      showResult: false, // shows only navigation, no results
      city: '',
      selectedTime: 'ljust-efter-jobbet_17:00-19:00',
      timeStart: '00:00',
      timeEnd: '23:59',
      timeSelection: [
        {
          name: 'på kvällen',
          times: '19:00-22:00',
          url: 'ljust-på-kvällen_19:00-22:00'
        },
        {
          name: 'sent på kvällen',
          times: '19:00-22:00',
          url: 'ljust-sent-på-kvällen_21:00-24:00'
        },
        {
          name: 'före jobbet',
          times: '06:00-08:00',
          url: 'ljust-före-jobbet_06:00-08:00'
        },
        {
          name: 'efter jobbet',
          times: '17:00-19:00',
          url: 'ljust-efter-jobbet_17:00-19:00'
        },
        {
          name: 'lite före och lite efter jobbet',
          times: '07:00-18:00',
          url: 'ljust-lite-före-och-lite-efter-jobbet_07:00-18:00'
        }
      ]
    }
    /**
     * @todo - the url field should be calculated form name and times
     */
  },
  asyncData(context) {
    // called every time before loading the component
    // as the name said, it can be async
    // Also, the returned object will be merged with your data object
    //console.log(context)
    /*
    return {
      currentPage: context.route.params[0]
    }
    */
    let output = {}
    const currentRoute = context.route.params[0]
    const route = currentRoute.split('/')

    //console.log(route)
    if (route[1]) {
      const city = route[1].split('-')
      output.city = city[1].charAt(0).toUpperCase() + city[1].slice(1)
      output.showSearch = false
    }
    if (route[2]) {
      const times = route[2].split('_')
      const times2 = times[1].split('-')
      let timeStart = times2[0] + (times2[0].length === 2 ? ':00' : '')
      let timeEnd = times2[1] + (times2[1].length === 2 ? ':00' : '')
      output.timeStart = timeStart
      output.timeEnd = timeEnd
      output.selectedTime = route[2]
    }
    if (route[1] && route[2]) {
      output.showResult = true
    }

    //context.error({ statusCode: 404, message: 'Post not found' })

    try {
      return context.$axios.$get(`/cities.json`).then(res => {
        output.ok = 'OK'
        output.cities = res
        output.currentPage = context.route.params[0]
        return output
      })
    } catch (e) {
      return {
        ok: 'Error'
      }
    }
  },
  computed: {
    getLat: function() {
      if (this.city in this.cities) {
        return this.cities[this.city][0]
      }
      return 60
    },
    getLong: function() {
      if (this.city in this.cities) {
        return this.cities[this.city][1]
      }
      return 18
    },
    timeSelected: function() {
      const selected = this.timeSelection.filter(
        result => result.url === this.selectedTime
      )

      if (selected.length === 1) {
        return selected[0]
      }

      return {
        name: 'mellan',
        times: this.timeStart + '-' + this.timeEnd
      }
    },
    citiesArray: function() {
      let allCities = Object.keys(this.cities)
      return allCities.sort()
    }
  },
  watch: {
    city: function() {
      this.navigate()
    }
  },
  methods: {
    urlencode: function(input) {
      return input.toLowerCase().replace(/ /g, '-')
    },
    navigate: function(toTime = '') {
      if (typeof toTime !== 'string' || toTime === '') {
        toTime = this.selectedTime
      }

      const goTo = '/var-är-bäst/i-' + this.city.toLowerCase() + '/' + toTime
      console.log('navigate to :' + goTo)
      this.$router.push({ path: goTo })
    },
    setTimeSelect: function(input) {
      this.navigate(input)
    },
    focusSearch: function() {
      this.showSearch = true

      setTimeout(() => {
        this.$refs.mySelect.$refs.search.focus()
      }, 1)
    }
  }
}
</script>

<style lang="scss">
h1 {
  display: inline;
}
.e-vSelect {
  display: inline-block;
  min-width: 400px;
  visibility: hidden;
  &.sActive {
    visibility: visible;
  }
}
</style>
