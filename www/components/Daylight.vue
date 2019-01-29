<template>
  <div class="e-daylight">

    <!--
    <Summary
      :keep-changing="totalScores.noChangeNorm"
      :only-summer="totalScores.alwaysSummerNorm"
      :only-winter="totalScores.alwaysWinterNorm"
    />
    -->

    <!--
    <h4>{{ lat }} {{ long }}</h4>
    <h3>Days better with constant:</h3>
    <h3>Wintertime: {{ winnerWinterCount }} Summertime: {{ winnerSummerCount }}</h3>
    <h3>Scores:</h3>
    <h4>No change: {{ totalScores.noChangeNorm }} Always Winter: {{ totalScores.alwaysWinterNorm }} Always summer: {{ totalScores.alwaysSummerNorm }} </h4>
    -->

    <!--
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
          <td>{{ day.dawn.format('HH:mm') }}</td>
          <td>{{ day.sunrise.format('HH:mm') }}</td>
          <td>{{ day.sunset.format('HH:mm') }}</td>
          <td>{{ day.dusk.format('HH:mm') }}</td>
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
            <Daygraph
              :base-date="day.momentObj"
              :prefer-start="preferStart"
              :prefer-end="preferEnd"
              :dawn="day.dawn"
              :sunrise="day.sunrise"
              :sunset="day.sunset"
              :dusk="day.dusk"
            />
          </td>

        </tr>
      </tbody>
    </table>
    -->
    <div
      v-for="day in timelist"
      :key="day.num"
      class="p-row"
    >
      <div
        v-if="day.day === '1'"
        class="p-month">{{ day.month }}</div>

      <div
        v-if="day.momentObj.format('MMDD') === '0331'"
        class="p-changeTime"
      >
        Sommartid börjar 31 mars 2019
      </div>
      <div
        v-if="day.momentObj.format('MMDD') === '1026'"
        class="p-changeTime"
      >
        Vintertid börjar 26 okt 2019
      </div>

      <div
        v-if="day.different || showAll || specificDate !== ''"
        class="p-day">{{ day.day }}</div>
      <div
        v-if="day.different || showAll || specificDate !== ''"
        class="p-graph">
        <Daygraph
          :base-date="day.momentObj"
          :prefer-start="preferStart"
          :prefer-end="preferEnd"
          :dawn="day.dawn"
          :sunrise="day.sunrise"
          :sunset="day.sunset"
          :dusk="day.dusk"
          :offset="day.dst ? -1:0"
        />
        <Daygraph
          :base-date="day.momentObj"
          :prefer-start="preferStart"
          :prefer-end="preferEnd"
          :dawn="day.dawn"
          :sunrise="day.sunrise"
          :sunset="day.sunset"
          :dusk="day.dusk"
          :offset="day.dst ? 0:1"
        />
      </div>

    </div>

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
      specificDate: '' // for debug, add a specific date
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
            momentObj: usedate.clone(),
            date: usedate.format('D MMM'),
            day: usedate.format('D'),
            month: usedate.format('MMMM'),
            dawn: dawn,
            sunrise: sunrise,
            sunset: sunset,
            dusk: dusk,
            dst: usedate.isDST(),
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

      // Stores the summary in vuex
      const summaryNoChange = output
        .map(item => item.scoreNormal.score)
        .reduce((prev, next) => prev + next)
      const summaryAlwaysWinter = output
        .map(item => item.alwaysWinter.score)
        .reduce((prev, next) => prev + next)
      const SummaryAlwaysSummer = output
        .map(item => item.alwaysSummer.score)
        .reduce((prev, next) => prev + next)
      const SummaryMax = Math.max(
        summaryNoChange,
        summaryAlwaysWinter,
        SummaryAlwaysSummer
      )

      this.$store.commit('totalScores/setValues', {
        keepChanging: round((summaryNoChange / SummaryMax) * 100, 2),
        onlySummer: round((SummaryAlwaysSummer / SummaryMax) * 100, 2),
        onlyWinter: round((summaryAlwaysWinter / SummaryMax) * 100, 2)
      })

      return output
    },
    winnerWinterCount: function() {
      return this.timelist.filter(r => r.winterWinner).length
    },
    winnerSummerCount: function() {
      return this.timelist.filter(r => r.summerWinner).length
    }
    /*
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
    */
  }
}
</script>

<style scoped lang="scss">
.e-daylight {
  display: inline-block;
  max-width: 500px;
  .p-row {
    display: flex;
    flex-wrap: wrap;
  }
  .p-month {
    font-family: $fontHandWritten;
    font-size: 3.6rem;
    text-transform: uppercase;
    flex-basis: 100%;
    margin-top: 20px;
    padding-bottom: 9px;
  }
  .p-changeTime {
    font-family: $fontHandWritten;
    font-size: 2.8rem;
    flex-basis: 100%;
    margin-top: 20px;
    margin-bottom: 20px;
    border-bottom: 1px dotted black;
  }
  .p-day {
    font-family: $fontModern;
    font-size: 4.8rem;
    font-weight: 300;
    text-align: center;
    flex-basis: 50px;
    flex-grow: 0;
    height: 105px;
    padding-top: 31px;
  }
  .p-graph {
    flex-basis: 80%;
    flex-grow: 1;
    flex-shrink: 1;
    padding-left: 15px;
  }
}
</style>
