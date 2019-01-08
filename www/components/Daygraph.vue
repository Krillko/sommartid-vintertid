<template>
  <div class="e-dayGraph">

    <div class="p-caption">

      <div
        v-for="theHour in hoursBetween.hourArr"
        :key="theHour"
        :style="{width: hoursBetween.width + '%'}"
        class="p-hour"
      ><p>{{ theHour }}</p></div>

    </div>
    {{ realstart.format('M-D HH:mm') }} {{ realend.format('M-D HH:mm') }} {{ hoursBetween.diffH }}
    <div class="p-graph">
      <div
        :style="{width: graphdata.night1 + '%'}"
        class="p-night1"/>
      <div
        :style="{width: graphdata.morning + '%'}"
        class="p-morning"/>
      <div
        :style="{width: graphdata.daytime + '%'}"
        class="p-day"/>
      <div
        :style="{width: graphdata.evening + '%'}"
        class="p-evening"/>
      <div
        :style="{width: graphdata.night2 + '%'}"
        class="p-night2"/>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { timeOverlap } from '~/extras/Helpers.js'

export default {
  name: 'Daygraph',
  props: {
    preferstart: {
      type: String,
      required: true
    },
    preferend: {
      type: String,
      required: true
    },
    dawn: {
      type: String,
      required: true
    },
    sunrise: {
      type: String,
      required: true
    },
    sunset: {
      type: String,
      required: true
    },
    dusk: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      day1: '2018-01-01'
    }
  },
  computed: {
    graphdata: function() {
      const periods = ['night1', 'morning', 'daytime', 'evening', 'night2']
      let output = {},
        qStart,
        qEnd

      for (let period of periods) {
        switch (period) {
          case 'night1':
            qStart = '00:00'
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
            qEnd = '23:59'
            break
        }
        //console.log(period + ' ' + qStart + '-' + qEnd)
        let timediff = timeOverlap(this.realstart, this.realend, qStart, qEnd)
        output[period] = Math.round((timediff / this.hoursBetween.diffM) * 100)
      }

      console.log(output)

      return output
    },
    realstart: function() {
      return moment(this.day1 + ' ' + this.preferstart).startOf('hour')
    },
    realend: function() {
      const startday = moment(this.day1)
      let thisday = moment(this.day1 + ' ' + this.preferend)
      thisday.add(1, 'hour')
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
  .p-caption {
    display: flex;
    width: 100%;
    margin-top: 18px;
    .p-hour {
      position: relative;
      height: 10px;
      p {
        text-align: center;
        position: absolute;
        top: -15px;
        left: -8px;
      }
      &:nth-child(odd) {
        background: grey;
      }
      &:last-child {
        background: red;
        width: 0 !important;
      }
    }
  }
  .p-graph {
    display: flex;
    width: 100%;
  }
  .p-night1,
  .p-morning,
  .p-day,
  .p-evening,
  .p-night2 {
    height: 30px;
  }
  .p-night1 {
    background: black;
  }
  .p-morning {
    background: gray;
  }
  .p-day {
    background: lightgreen;
  }
  .p-evening {
    background: gray;
  }
  .p-night2 {
    background: black;
  }
}
</style>
