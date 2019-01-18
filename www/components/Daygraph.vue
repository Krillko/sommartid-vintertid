<template>
  <div
    :class="{'m-NoDawnIcon': graphdata.noDawnIcon}"
    class="e-dayGraph">
    <div class="p-caption">
      <div
        v-for="theHour in hoursBetween.hourArr"
        :key="theHour"
        :style="{width: hoursBetween.width + '%'}"
        class="p-hour"
      ><p>{{ theHour }}</p></div>
    </div>
    <div class="p-graph">
      <div
        v-if="graphdata.night1 > 0"
        :style="{width: graphdata.night1 + '%'}"
        class="p-block p-night1"/>
      <div
        v-if="graphdata.morning > 0"
        :style="{width: graphdata.morning + '%'}"
        class="p-block p-morning"/>
      <div
        v-if="graphdata.daytime > 0"
        :style="{width: graphdata.daytime + '%'}"
        class="p-block p-day"/>
      <div
        v-if="graphdata.evening > 0"
        :style="{width: graphdata.evening + '%'}"
        class="p-block p-evening"/>
      <div
        v-if="graphdata.night2 > 0"
        :style="{width: graphdata.night2 + '%'}"
        class="p-block p-night2"/>
    </div>
    <!--
    <div class="p-caption m-notFirst">
      <div
        v-for="theHour in hoursBetween.hourArr"
        :key="theHour"
        :style="{width: hoursBetween.width + '%'}"
        class="p-hour"
      />
    </div>
    -->

  </div>
</template>

<script>
import moment from 'moment'
import { timeOverlap, isSummer } from '~/extras/Helpers.js'

export default {
  name: 'Daygraph',
  props: {
    preferStart: {
      type: String,
      required: true
    },
    preferEnd: {
      type: String,
      required: true
    },
    dawn: {
      type: Object,
      required: true
    },
    sunrise: {
      type: Object,
      required: true
    },
    sunset: {
      type: Object,
      required: true
    },
    dusk: {
      type: Object,
      required: true
    },
    baseDate: {
      type: Object,
      required: true
    },
    offset: {
      type: Number,
      default: function() {
        return 0
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    /**
     * @return {{noDawnIcon: boolean}}
     */
    graphdata: function() {
      const periods = ['night1', 'morning', 'daytime', 'evening', 'night2']
      let output = {
          noDawnIcon: false
        },
        qStart,
        qEnd

      const dayStart = this.baseDate.clone().set({ h: 0, m: 0 })
      const dayEnd = this.baseDate
        .clone()
        .add(1, 'd')
        .startOf('d')

      for (let period of periods) {
        switch (period) {
          case 'night1':
            qStart = dayStart
            qEnd = this.dawn
            break
          case 'morning':
            qStart = this.dawn
            qEnd = this.sunrise
            break
          case 'daytime':
            qStart = this.sunrise
            qEnd = this.sunset
            break
          case 'evening':
            qStart = this.sunset
            qEnd = this.dusk
            break
          case 'night2':
            qStart = this.dusk
            qEnd = dayEnd
            break
        }

        if (
          !this.dawn.isValid() &&
          !this.sunrise.isValid() &&
          !this.sunset.isValid() &&
          !this.dusk.isValid()
        ) {
          if (isSummer(this.baseDate.month())) {
            //console('Midnight sun')
            qStart = dayStart
            if (period === 'daytime') {
              qEnd = dayEnd
            } else {
              qEnd = dayStart
            }
          } else {
            console.warn('Polar winter? Whats going on')
          }
        } else if (!this.sunrise.isValid() && !this.sunset.isValid()) {
          //console('Polar winter')
          output.noDawnIcon = true
          switch (period) {
            case 'night1':
              qStart = dayStart
              qEnd = this.dawn
              break
            case 'morning':
              qStart = this.dawn
              qEnd = this.dusk
              break
            case 'night2':
              qStart = this.dusk
              qEnd = dayEnd
              break
            default:
              qStart = dayStart
              qEnd = dayStart
          }
        } else if (!this.dawn.isValid() && !this.dusk.isValid()) {
          //console('close to midnight sun')
          switch (period) {
            case 'night1':
              qStart = dayStart
              qEnd = dayStart
              break
            case 'morning':
              qStart = dayStart
              qEnd = this.sunrise
              break
            case 'evening':
              qStart = this.sunset
              qEnd = dayEnd
              break
            case 'night2':
              qStart = dayEnd
              qEnd = dayEnd
              break
          }
        }

        //console.warn(period)

        let timediff = timeOverlap(
          this.baseDate,
          this.realstart,
          this.realend,
          qStart,
          qEnd,
          this.offset
        )
        output[period] = Math.round((timediff / this.hoursBetween.diffM) * 100)
      }

      //console(output)

      return output
    },
    realstart: function() {
      const preferArr = this.preferStart.split(':')

      //console(this.baseDate)

      const output = this.baseDate
        .clone()
        .set({ h: preferArr[0], m: preferArr[1] })
      //console(output)
      return output
    },
    realend: function() {
      const preferArr = this.preferEnd.split(':')

      //console(this.baseDate)

      let thisday = this.baseDate
        .clone()
        .set({ h: preferArr[0], m: preferArr[1] })

      if (thisday.format('m') !== '0') {
        thisday.add(1, 'hour')
      }
      return thisday.startOf('hour')
    },
    hoursBetween: function() {
      const diff = this.realend.diff(this.realstart, 'h')
      let hourArr = []
      for (let x = 0; x <= diff; x++) {
        hourArr.push(
          this.realstart
            .clone()
            .add(x, 'hour')
            .format('HH')
        )
      }

      return {
        diffH: diff,
        diffM: diff * 60,
        hourArr: hourArr,
        width: 100 / (diff - 1)
      }
    }
  }
}
</script>

<style lang="scss">
.e-dayGraph {
  width: 300px;
  &:first-child {
    .p-caption {
      margin-top: 18px;
      .p-hour {
        p {
          display: inline-block;
        }
      }
    }
  }
  .p-caption {
    display: flex;
    width: 100%;
    margin-top: 0;
    .p-hour {
      position: relative;
      height: 9px;
      border-right: 1px solid #b5b5b5;
      p {
        font-family: 'Helvetica Neue', Helvetica, sans-serif;
        font-size: 1rem;
        font-weight: bold;
        text-align: center;
        position: absolute;
        top: -15px;
        left: -8px;
        display: none;
      }
      &:first-child {
        border-left: 1px solid #b5b5b5;
      }
      &:last-child {
        width: 0 !important;
        border-right: none;
      }
    }
  }
  .p-graph {
    display: flex;
    width: 100%;
    .p-block {
      flex-grow: 1;
    }
  }
  .p-night1,
  .p-morning,
  .p-day,
  .p-evening,
  .p-night2 {
    height: 22px;
    border: 1px solid black;
  }
  .p-night1,
  .p-night2 {
    background: black url('/pics/night.svg') no-repeat 3px 3px;
    background-size: 12px 12px;
  }
  .p-morning {
    background: #c1c1c1 url('/pics/sunrise.svg') no-repeat 3px 3px;
    background-size: 12px 12px;
  }
  .p-day {
    background: #fcfbfc url('/pics/sun.svg') no-repeat 3px 3px;
    background-size: 12px 12px;
  }
  .p-evening {
    background: #c1c1c1 url('/pics/sunset.svg') no-repeat 3px 3px;
    background-size: 12px 12px;
  }
}
</style>
