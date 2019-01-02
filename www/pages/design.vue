<template>
  <div>
    <Summary
      :keep-changing="keepChanging"
      :only-summer="onlySummer"
      :only-winter="onlyWinter"
    />

    <button @click="randomNumbers">Slumpa</button>
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
      onlySummer: 66,
      onlyWinter: 82
    }
  },
  asyncData(context) {
    // called every time before loading the component
    // as the name said, it can be async
    // Also, the returned object will be merged with your data object
    return {}
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
    }
  }
}
</script>

<style lang="scss">
body {
  padding: 20px;
}
</style>
