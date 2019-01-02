<template>
  <span>
    <div class="e-summary">
      <div
        class="e-staple m-gold"
        style="height: 100%">
        <div class="p-bg"/>
        <div class="p-main">
          <div class="p-score">100%</div>
        </div>
        <Medal class="p-medal"/>
      </div>

      <div
        class="e-staple m-bronze"
        style="height: 66%">
        <div class="p-bg"/>
        <div class="p-main">
          <div class="p-score">66%</div>
        </div>
        <Medal class="p-medal"/>
      </div>

      <div
        class="e-staple m-silver"
        style="height: 82%">
        <div class="p-bg"/>
        <div class="p-main">
          <div class="p-score">82%</div>
        </div>
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

export default {
  components: {
    Medal
  },
  asyncData(context) {
    // called every time before loading the component
    // as the name said, it can be async
    // Also, the returned object will be merged with your data object
    return {}
  }
}
</script>

<style lang="scss">
body {
  padding: 20px;
}

.e-summary {
  display: flex;
  align-items: flex-end;
  margin-bottom: 10px;
  width: 800px;
  height: 400px;
  border-bottom: 2px solid black;
}
.e-summaryCaption {
  display: flex;
  align-items: flex-end;
  width: 800px;
  font-family: 'Cormorant', serif;
  font-size: 22px;
  .p-caption {
    width: 33%;
    margin-left: 20px;
    margin-right: 20px;
    text-align: center;
    img {
      display: inline-block;
      height: 20px;
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
