<template>
  <div class="e-daylight">

    <h4>{{ lat }} {{ long }}</h4>

    <table>
      <thead>
        <tr>
          <th>Day</th>
          <th>dawn</th>
          <th>sunrise</th>
          <th>sunset</th>
          <th>dusk</th>
          <th>tid</th>
        </tr>
      </thead>

      <tr
        v-for="day in timelist"
        :key="day.num"
      >
        <td>{{ day.date }}</td>
        <td>{{ day.dawn }}</td>
        <td>{{ day.sunrise }}</td>
        <td>{{ day.sunset }}</td>
        <td>{{ day.dusk }}</td>
        <td>{{ day.dst }}</td>
      </tr>

    </table>
  </div>
</template>

<script>
import moment from 'moment'
import SunCalc from 'suncalc'
/*
Kolla att använda denna:
https://github.com/perfectline/geopoint/blob/master/geopoint.js
 */
export default {
  name: 'Daylight',
  props: {
    lat: {
      type: Number,
      default: 60
    },
    long: {
      type: Number,
      default: 18
    },
    preferstart: {
      type: String,
      default: '17:00'
    },
    preferend: {
      type: String,
      default: '17:00'
    },
    year: {
      type: Number,
      default: 2018
    }
  },
  computed: {
    timelist: function() {
      moment().utcOffset(60)
      moment.locale('sv')

      console.log('here')
      console.log(this.year)

      let output = [],
        usedate = moment(this.year + ' 12:00:00'), // uses a time after 2 because dst starts then
        i = 0,
        times = {}

      while (usedate.year() === this.year) {
        times = SunCalc.getTimes(usedate.toDate(), this.lat, this.long)
        output.push({
          num: i,
          date: usedate.format('D MMM'),
          dawn: times.dawn.getHours() + ':' + times.dawn.getMinutes(),
          sunrise: times.sunrise.getHours() + ':' + times.sunrise.getMinutes(),
          sunset: times.sunset.getHours() + ':' + times.sunset.getMinutes(),
          dusk: times.dusk.getHours() + ':' + times.dusk.getMinutes(),
          dst: usedate.isDST() ? 'Sommartid' : ''
        })
        usedate.add(1, 'd')
        i++
      }

      output.push({
        num: i,
        date: usedate.format('YYYY MM DD')
      })

      return output
    }
  }
}
</script>

<style scoped lang="scss">
.e-daylight {
  tr {
    &:nth-child(odd) {
      background: #ededed;
    }
  }
  th {
    padding: 5px;
  }
  td {
    padding: 5px;
    text-align: left;
  }
}
</style>
