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
    {{ realstart.format('M-D HH') }} {{ realend.format('M-D HH') }} {{ hoursBetween.diff }}
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
      return {
        night1: 10,
        morning: 20,
        daytime: 50,
        evening: 20,
        night2: 10
      }
    },
    realstart: function() {
      return moment(this.day1 + ' ' + this.preferstart).startOf('hour')
    },
    realend: function() {
      const startday = moment(this.day1)
      let thisday = moment(this.day1 + ' ' + this.preferend)
      thisday.add(1, 'hour')
      return thisday.endOf('hour')
    },
    hoursBetween: function() {
      const diff = this.realend.diff(this.realstart, 'h')
      let hourArr = []
      console.log(diff)
      for (let x = 0; x <= diff; x++) {
        hourArr.push(
          this.realstart
            .clone()
            .add(x, 'hour')
            .format('HH')
        )
      }

      return {
        diff: diff,
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
