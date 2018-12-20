<template>
  <div class="e-daylight">

    <h4>{{ lat }} {{ long }}</h4>


    <h3>Days better with constant:</h3>
    <h3>Wintertime: {{ winnerWinterCount }} Summertime: {{ winnerSummerCount }}</h3>

    <h3>Scores:</h3>
    <h4>No change: {{ totalScores.noChangeNorm }} Always Winter: {{ totalScores.alwaysWinterNorm }} Always summer: {{ totalScores.alwaysSummerNorm }} </h4>

    <table>
      <thead>
        <tr>
          <th>Day</th>
          <th>dawn</th>
          <th>sunrise</th>
          <th>sunset</th>
          <th>dusk</th>
          <th>tid</th>
          <th>minuter sol</th>
          <th>always winter</th>
          <th>always summer</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="day in timelist"
          v-if="day.different"
          :key="day.num"
        >
          <td>{{ day.date }}</td>
          <td>{{ day.dawn }}</td>
          <td>{{ day.sunrise }}</td>
          <td>{{ day.sunset }}</td>
          <td>{{ day.dusk }}</td>
          <td>{{ day.dst }}</td>
          <td>
            <code>
              {{ day.scoreNormal.minSun }} min sun<br>
              {{ day.scoreNormal.minDawn }} min dawn<br>
              {{ day.scoreNormal.minDusk }} min dusk<br>
            </code>
            <b>{{ day.scoreNormal.score }}</b>
          </td>
          <td :class="{ winner : day.winterWinner }">
            <code>
              {{ day.alwaysWinter.minSun }} min sun<br>
              {{ day.alwaysWinter.minDawn }} min dawn<br>
              {{ day.alwaysWinter.minDusk }} min dusk<br>
            </code>
            <b>{{ day.alwaysWinter.score }}</b>
          </td>
          <td :class="{ winner : day.summerWinner }">
            <code>
              {{ day.alwaysSummer.minSun }} min sun<br>
              {{ day.alwaysSummer.minDawn }} min dawn<br>
              {{ day.alwaysSummer.minDusk }} min dusk<br>
            </code>
            <b>{{ day.alwaysSummer.score }}</b>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import moment from 'moment'
import SunCalc from 'suncalc'
import { timeOverlap, getTimeScore, round } from '~/extras/Helpers.js'

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
      default: '19:00'
    },
    year: {
      type: Number,
      default: 2018
    },
    pointsSun: {
      type: Number,
      default: 5
    },
    pointsDawnDusk: {
      type: Number,
      default: 1
    }
  },
  computed: {
    timelist: function() {
      moment().utcOffset(60)
      moment.locale('sv')

      let output = [],
        usedate = moment(this.year + ' 12:00:00'), // uses a time after 2 because dst starts then
        i = 0,
        times = {},
        dawn,
        sunrise,
        sunset,
        dusk,
        minutesSun,
        scoreNormal,
        alwaysWinter,
        alwaysSummer

      while (usedate.year() === this.year) {
        times = SunCalc.getTimes(usedate.toDate(), this.lat, this.long)
        dawn = times.dawn.getHours() + ':' + times.dawn.getMinutes()
        sunrise = times.sunrise.getHours() + ':' + times.sunrise.getMinutes()
        sunset = times.sunset.getHours() + ':' + times.sunset.getMinutes()
        dusk = times.dusk.getHours() + ':' + times.dusk.getMinutes()

        console.log(this.pointsSun)

        scoreNormal = getTimeScore(
          dawn,
          sunrise,
          sunset,
          dusk,
          this.preferstart,
          this.preferend,
          0,
          this.pointsSun,
          this.pointsDawnDusk
        )

        if (usedate.isDST()) {
          alwaysSummer = scoreNormal
          alwaysWinter = getTimeScore(
            dawn,
            sunrise,
            sunset,
            dusk,
            this.preferstart,
            this.preferend,
            -1,
            this.pointsSun,
            this.pointsDawnDusk
          )
        } else {
          alwaysSummer = getTimeScore(
            dawn,
            sunrise,
            sunset,
            dusk,
            this.preferstart,
            this.preferend,
            1,
            this.pointsSun,
            this.pointsDawnDusk
          )
          alwaysWinter = scoreNormal
        }

        output.push({
          num: i,
          date: usedate.format('D MMM'),
          dawn: dawn,
          sunrise: sunrise,
          sunset: sunset,
          dusk: dusk,
          dst: usedate.isDST() ? 'Sommartid' : '',
          scoreNormal: scoreNormal,
          alwaysWinter: alwaysWinter,
          alwaysSummer: alwaysSummer,
          different: alwaysSummer.score !== alwaysWinter.score,
          winterWinner: alwaysWinter.score > alwaysSummer.score,
          summerWinner: alwaysSummer.score > alwaysWinter.score
        })
        usedate.add(1, 'd')
        i++
      }

      return output
    },
    winnerWinterCount: function() {
      return this.timelist.filter(r => r.winterWinner).length
    },
    winnerSummerCount: function() {
      return this.timelist.filter(r => r.summerWinner).length
    },
    totalScores: function() {
      const noChange = this.timelist
        .map(item => item.scoreNormal.score)
        .reduce((prev, next) => prev + next)
      const alwaysWinter = this.timelist
        .map(item => item.alwaysWinter.score)
        .reduce((prev, next) => prev + next)
      const alwaysSummer = this.timelist
        .map(item => item.alwaysSummer.score)
        .reduce((prev, next) => prev + next)
      const max = Math.max(noChange, alwaysWinter, alwaysSummer)

      return {
        noChange: noChange,
        alwaysWinter: alwaysWinter,
        alwaysSummer: alwaysSummer,
        noChangeNorm: round((noChange / max) * 100, 2),
        alwaysWinterNorm: round((alwaysWinter / max) * 100, 2),
        alwaysSummerNorm: round((alwaysSummer / max) * 100, 2)
      }
    }
  }
}
</script>

<style scoped lang="scss">
h1,
h2,
h3,
h4 {
  font-weight: normal;
}
.e-daylight {
  margin-top: 40px;
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
    &.winner {
      background: lightgreen;
    }
  }
}
</style>
