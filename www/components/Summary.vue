<template>
  <span>
    <div class="e-summary">
      <div
        :style="{ height: keepChanging + '%' }"
        :class="medalkeepChanging"
        class="e-staple"
      >
        <div class="p-bg"/>
        <div class="p-main"/>
        <div
          :class="{ 'm-top': (keepChanging >= 30), 'm-bottom': (keepChanging < 30) }"
          class="p-score"
        >{{ Math.round(keepChanging) }}%</div>
        <Medal class="p-medal"/>
      </div>

      <div
        :style="{ height: onlySummer + '%' }"
        :class="medalonlySummer"
        class="e-staple">
        <div class="p-bg"/>
        <div class="p-main" />
        <div
          :class="{ 'm-top': (onlySummer >= 30), 'm-bottom': (onlySummer < 30) }"
          class="p-score"
        >{{ Math.round(onlySummer) }}%</div>
        <Medal class="p-medal"/>
      </div>

      <div
        :style="{ height: onlyWinter + '%' }"
        :class="medalonlyWinter"
        class="e-staple">
        <div class="p-bg"/>
        <div class="p-main"/>
        <div
          :class="{ 'm-top': (onlyWinter >= 30), 'm-bottom': (onlyWinter < 30) }"
          class="p-score"
        >{{ Math.round(onlyWinter) }}%</div>
        <Medal class="p-medal"/>
      </div>

    </div>
    <div class="e-summaryCaption">
      <div class="p-caption">
        <img
          src="/pics/keepChanging.svg"
          alt="Fortsätta byta">
        <span>Fortsätta byta</span>
      </div>
      <div class="p-caption">
        <img
          src="/pics/summertime.svg"
          alt="Bara sommartid">
        <span>Bara sommartid</span>
      </div>
      <div class="p-caption">
        <img
          src="/pics/wintertime.svg"
          alt="Bara Vintertid">
        <span>Bara Vintertid</span>
      </div>
    </div>
  </span>
</template>

<script>
import Medal from '~/assets/medal.svg'
//import AnimatedNumber from 'animated-number-vue'

export default {
  name: 'Summary',
  components: {
    Medal
    //AnimatedNumber
  },
  data: function() {
    return {
      medalkeepChanging: '',
      medalonlySummer: '',
      medalonlyWinter: ''
    }
  },
  computed: {
    keepChanging() {
      return this.$store.state.totalScores.summary.keepChanging
    },
    onlySummer() {
      return this.$store.state.totalScores.summary.onlySummer
    },
    onlyWinter() {
      return this.$store.state.totalScores.summary.onlyWinter
    }
  },
  asyncData(context) {
    // called every time before loading the component
    // as the name said, it can be async
    // Also, the returned object will be merged with your data object
    return {}
  },
  mounted: function() {
    this.giveMedals()
  },
  beforeUpdate: function() {
    this.giveMedals()
  },
  methods: {
    giveMedals: function() {
      let pointorder = [this.keepChanging, this.onlySummer, this.onlyWinter]
      pointorder.sort(function(a, b) {
        return b - a
      })
      pointorder = pointorder.filter((v, i, a) => a.indexOf(v) === i)

      let output = {}
      let medalno = 0
      let medals = ['m-gold', 'm-silver', 'm-bronze']
      let currentMedal = 0
      pointorder.forEach(porder => {
        ;['keepChanging', 'onlySummer', 'onlyWinter'].forEach(param => {
          if (this[param] === porder) {
            medalno++
            this['medal' + param] = medals[currentMedal]
          }
        })
        currentMedal += medalno > 1 ? 2 : 1
        medalno = 0
      })
    }
  }
}
</script>

<style lang="scss">
.e-summary {
  display: flex;
  align-items: flex-end;
  margin-bottom: 10px;
  width: 800px;
  height: 400px;
  border-bottom: 2px solid black;
  overflow: hidden;
}
.e-summaryCaption {
  display: flex;
  align-items: flex-end;
  width: 800px;
  font-family: 'EB Garamond', serif;
  //text-transform: lowercase;
  font-size: 24px;
  .p-caption {
    width: 33%;
    margin-left: 20px;
    margin-right: 20px;
    text-align: center;
    img {
      display: inline-block;
      height: 18px;
      vertical-align: baseline;
    }
    img,
    span {
      vertical-align: baseline;
    }
  }
}
.e-staple {
  background: #7f828b;
  width: 33%;
  position: relative;
  margin-left: 45px;
  margin-right: 45px;
  transition: height 1s;
  .p-main {
    width: 100%;
    height: 100%;
    position: absolute;
    bottom: 0;
    background: white;
    border-top: 1px solid black;
    border-left: 1px solid black;
    border-right: 2px solid black;
  }
  .p-score {
    font-family: 'Roboto', sans-serif;
    font-size: 60px;
    position: absolute;
    bottom: 20px;
    width: 100%;
    text-align: center;
    transition: bottom 0.5s;
    &.m-top {
      transition-delay: 0s;
    }
    &.m-bottom {
      bottom: 100%;
      transition-delay: 0.5s;
    }
  }
  .p-bg {
    width: 100%;
    height: calc(100% - 7px);
    position: absolute;
    bottom: 0;
    left: 7px;
    background: url('/pics/diagonal-lines.svg');
    background-size: 5px;
  }
  .p-medal {
    position: absolute;
    top: 0;
    right: 15px;
    height: 60px;
  }
  svg {
    .place1,
    .place2,
    .place3 {
      visibility: hidden;
    }
  }
  &.m-gold {
    svg {
      .outside {
        fill: #f5c06c;
      }
      #inside {
        fill: #fae08e !important;
      }
      .place1 {
        visibility: visible;
      }
    }
  }
  &.m-silver {
    svg {
      .outside {
        fill: #a0a8d5;
      }
      #inside {
        fill: #c5cae6 !important;
      }
      .place2 {
        visibility: visible;
      }
    }
  }
  &.m-bronze {
    svg {
      .outside {
        fill: #ac8f7e;
      }
      #inside {
        fill: #c8b1a2 !important;
      }
      .place3 {
        visibility: visible;
      }
    }
  }
}
</style>
