<template>
  <div>
    <div class="e-headlines">
      <h2>Vad är bäst?</h2>
      <h1>Sommartid <span>eller</span> Vintertid</h1>
      <div class="p-selectors">
        I
        <select>
          <option selected>Välj stad</option>
          <option>Stockholm</option>
        </select>
        om man vill ha ljus
        <select>
          <option>efter jobbet (17:00-19:00)</option>
        </select>
      </div>
    </div>

    <Summary
      :keep-changing="keepChanging"
      :only-summer="onlySummer"
      :only-winter="onlyWinter"
    />

    <button @click="randomNumbers">Slumpa</button>
    <button @click="numbers1">Fixa</button>
    <button @click="numbers2">Fixa 2</button>
  </div>
</template>
<script>
import Summary from '~/components/Summary.vue'

export default {
  components: {
    Summary
  },
  data: function() {
    return {
      keepChanging: 100,
      onlySummer: 99,
      onlyWinter: 82
    }
  },
  asyncData(context) {
    // called every time before loading the component
    // as the name said, it can be async
    // Also, the returned object will be merged with your data object
    return {}
  },
  updated: function() {
    //console.log('* * * * design updated')
  },
  methods: {
    randomNumbers: function() {
      let results = [
        Math.round(Math.random() * (100 - 1) + 1),
        Math.round(Math.random() * (100 - 1) + 1),
        Math.round(Math.random() * (100 - 1) + 1)
      ]

      let winner = Math.round(Math.random() * 2)
      results[winner] = 100

      this.keepChanging = results[0]
      this.onlySummer = results[1]
      this.onlyWinter = results[2]
    },
    numbers1: function() {
      this.keepChanging = 100
      this.onlySummer = 100
      this.onlyWinter = 50
    },
    numbers2: function() {
      this.keepChanging = 28
      this.onlySummer = 10
      this.onlyWinter = 25
    }
  }
}
</script>

<style lang="scss">
body {
  padding: 20px;
}
h1,
h2,
h3 {
  font-weight: normal;
}
.e-headlines {
  margin-bottom: 30px;
  width: 800px;
  h1 {
    font-weight: 400;
    font-family: 'Roboto', sans-serif;
    //display: inline;
    font-size: 122px;
    span {
      font-size: 72px;
    }
  }
  h2,
  h3 {
    font-family: 'EB Garamond', serif;
    //display: inline;
    font-size: 48px;
  }
}
</style>
