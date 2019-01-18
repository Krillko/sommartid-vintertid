<template>
  <div class="e-daylight">

    <!--
    <Summary
      :keep-changing="totalScores.noChangeNorm"
      :only-summer="totalScores.alwaysSummerNorm"
      :only-winter="totalScores.alwaysWinterNorm"
    />
    -->

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
          <th>graph</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="day in timelist"
          v-if="day.different || showAll || specificDate !== ''"
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

          <td>
            <!--
            <Daygraph
              :preferStart="preferStart"
              :preferEnd="preferEnd"
              :dawn="day.dawn"
              :sunrise="day.sunrise"
              :sunset="day.sunset"
              :dusk="day.dusk"
            />
            -->
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
import Summary from '~/components/Summary.vue'
import Daygraph from '~/components/Daygraph.vue'

/*
Kolla att använda denna:
https://github.com/perfectline/geopoint/blob/master/geopoint.js
 */
export default {
  name: 'Daylight',
  components: {
    Summary,
    Daygraph
  },
  props: {
    lat: {
      type: Number,
      default: 60
    },
    long: {
      type: Number,
      default: 18
    },
    preferStart: {
      type: String,
      default: '17:00'
    },
    preferEnd: {
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
  data() {
    return {
      showAll: false,
      specificDate: '7 jun'
    }
  },
  computed: {
    timelist: function() {
      moment().utcOffset(60)
      moment.locale('sv')

      let output = [],
        usedate = moment(this.year + '-01-01 12:00:00', 'YYYY-MM-DD HH:mm:ss'), // uses a time after 2 because dst starts then
        i = 0,
        times = {},
        dawn,
        sunrise,
        sunset,
        dusk,
        minutesSun,
        scoreNormal,
        alwaysWinter,
        alwaysSummer,
        preferStartIn = this.preferStart.split(':'),
        preferEndIn = this.preferEnd.split(':'),
        preferStart,
        preferEnd

      while (usedate.year() === this.year) {
        if (
          usedate.format('D MMM') === this.specificDate ||
          this.specificDate === ''
        ) {
          /*
          let preferStart = moment(this.year + '-01-01 ' + this.preferStart)
          let preferEnd
          if (this.preferEnd === '00:00') {
            preferEnd = preferStart.clone()
            preferEnd.add(1, 'd')
            console.log(preferEnd)
            preferEnd.startOf('day')
          } else {
            console.log(this.preferEnd)
            preferEnd = moment(this.year + '-01-01 ' + this.preferEnd)
          }
          */
          preferStart = usedate
            .clone()
            .set({ h: preferStartIn[0], m: preferStartIn[1] })
          preferEnd = usedate
            .clone()
            .set({ h: preferEndIn[0], m: preferEndIn[1] })
          if (this.preferEnd === '00:00') {
            preferEnd.add(1, 'd')
          }

          times = SunCalc.getTimes(usedate.toDate(), this.lat, this.long)
          dawn = moment(times.dawn)
          sunrise = moment(times.sunrise)
          sunset = moment(times.sunset)
          dusk = moment(times.dusk)

          //console.log(this.pointsSun)

          scoreNormal = getTimeScore(
            usedate,
            dawn,
            sunrise,
            sunset,
            dusk,
            preferStart,
            preferEnd,
            0,
            this.pointsSun,
            this.pointsDawnDusk
          )

          if (usedate.isDST()) {
            alwaysSummer = scoreNormal
            alwaysWinter = getTimeScore(
              usedate,
              dawn,
              sunrise,
              sunset,
              dusk,
              preferStart,
              preferEnd,
              -1,
              this.pointsSun,
              this.pointsDawnDusk
            )
          } else {
            alwaysSummer = getTimeScore(
              usedate,
              dawn,
              sunrise,
              sunset,
              dusk,
              preferStart,
              preferEnd,
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
        }
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
