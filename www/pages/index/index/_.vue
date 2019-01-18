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
    <main class="e-main">
      <div class="e-mainHeadline">
        <h1>Sommartid <span>eller</span> Vintertid</h1>
      </div>

      <div class="e-selectors">
        <div class="e-citySelector">
          <h2>Vad är bäst i <div
            v-if="!showSearch"
            class="p-city"
            @click="focusSearch"
          >{{ city }}</div></h2>
          <div
            :class="{ sActive: showSearch }"
            class="e-vSelect"
          >
            <no-ssr>
              <v-select
                ref="mySelect"
                v-model="city"
                :options="citiesArray"
                class="e-dropdown"
                placeholder="välj stad"
                @change="navigate"
              />
            </no-ssr>
          </div>
        </div>

        <h2>Om man vill ha som mest ljus</h2>
        <Timeselector
          :time-selected="timeSelected"
          :time-selection="timeSelection"
          @setTimeselect="setTimeSelect"
        />

      </div>
      <div class="e-bars">Bars</div>


      <section v-if="showResult">
        <Daylight
          :lat="getLat"
          :long="getLong"
          :prefer-start="timeStart"
          :prefer-end="timeEnd"
        />
      <!--
        //Todo: add           :points-sun="pointsSun"
        //  :points-dawn-dusk="pointsDawnDusk"
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
      console.log('city: "' + this.city + '"')
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
.e-main {
  display: flex;
  flex-wrap: wrap;
}
.e-mainHeadline {
  flex-basis: 100%;
  width: 100%;
  max-width: 1368px;
  padding: 8px 22px;
  h1 {
    span {
      font-size: 4.8rem;
    }
  }
}
.e-selectors {
  //background: #ededed7f;
  flex-basis: 55%;
  padding: 18px 27px;
  h2 {
    display: inline-block;
    line-height: 3.7px;
    .p-city {
      display: inline-block;
      border: 1px dashed black;
      padding: 29px 72px 24px 12px;
      margin-left: 8px;
      background: url('/pics/downarrow.svg') no-repeat calc(100% - 10px) 20px;
      background-size: 38px 22px;
    }
  }
  .e-dropselector {
    margin: 17px 0 0 2px;
  }
}
.e-citySelector {
  height: 100px;
  width: 100%;
  //overflow: hidden;
}

.e-vSelect {
  display: inline-block;
  min-width: 400px;
  visibility: hidden;
  &.sActive {
    visibility: visible;
  }
}

.e-dropselector {
  border: 1px dashed black;
  border-radius: 0;
  display: inline-block;
  font-family: 'Josefin Slab', serif;
  font-size: 3.6rem;
  padding: 10px 60px 10px 8px;
  position: relative;
  span {
    font-size: 2.4rem;
  }
  .p-switch {
    @include uibutton;
    position: absolute;
    right: 8px;
    top: 19px;
    background: url('/pics/downarrow.svg') no-repeat;
    background-size: 38px 22px;
    width: 38px;
    height: 22px;
    &.m-dropped {
      transform: rotate(180deg);
    }
  }
}

.v-select {
  margin-left: 15px;
  .dropdown-toggle {
    border: 1px dashed black;
    border-radius: 0;
  }
  .selected-tag {
    display: none;
  }
  .dropdown-toggle {
    .clear {
      display: none !important;
    }
  }
  &.open {
    .open-indicator {
      &:before {
        transform: rotate(180deg);
      }
    }
  }
  .open-indicator {
    width: unset;
    &:before {
      border: none;
      background: url('/pics/downarrow.svg') no-repeat;
      background-size: 38px 22px;
      width: 38px;
      height: 22px;
      margin-top: 6px;
    }
  }

  input[type='search'] {
    padding: 10px 0 0 6px;
    line-height: 3.7px;
    min-height: 48px;

    &::placeholder {
      font-family: 'Josefin Slab', serif;
      font-style: italic;
      font-size: 3.6rem;
      color: #166816;
    }

    &:focus {
      font-family: 'Josefin Slab', serif;
      font-style: italic;
      font-size: 3.6rem;
      line-height: 3.7px;
      padding: 3px 0 0 6px;
      color: #166816;
      &::placeholder {
        opacity: 0;
      }
    }
  }
}

.e-bars {
  background: #dfdfdf7f;
  flex-basis: 45%;
}
</style>
