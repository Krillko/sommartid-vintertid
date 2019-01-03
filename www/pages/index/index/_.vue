<template>
  <div>
    <h1>/index/index/_.vue</h1>
    <h2>{{ currentPage }}</h2>
    <h2>{{ ok }}</h2>
    <p>City: {{ city }}</p>
    <p>Start: {{ timeStart }}</p>
    <p>End: {{ timeEnd }}</p>

    <header>
      <h1>Vad är bäst</h1>
      <nav>
        Vad är bäst i
        <select v-model="city">
          <option
            v-for="(value, key) in cities"
            :key="key">
            {{ key }}
          </option>
        </select>
        om man vill ha mest ljus

      </nav>
    </header>

  </div>
</template>

<script>
export default {
  name: 'FullPage',
  components: {},
  data() {
    return {
      showResult: false, // shows only navigation, no results
      city: '',
      selectedTime: '',
      timeStart: '00:00',
      timeEnd: '23:59',
      timeSelection: [{ name: 'Ljust på kvällen', times: '19:00-23:00' }]
    }
  },
  asyncData(context) {
    // called every time before loading the component
    // as the name said, it can be async
    // Also, the returned object will be merged with your data object
    //console.log(context)
    /*
    return {
      currentPage: context.route.params[0]
    }
    */
    let output = {}
    const currentRoute = context.route.params[0]
    const route = currentRoute.split('/')

    console.log(route)
    if (route[1]) {
      const city = route[1].split('-')
      output.city = city[1].charAt(0).toUpperCase() + city[1].slice(1)
    }
    if (route[2]) {
      const times = route[2].split('_')
      const times2 = times[1].split('-')
      let timeStart = times2[0] + (times2[0].length === 2 ? ':00' : '')
      let timeEnd = times2[1] + (times2[1].length === 2 ? ':00' : '')
      output.timeStart = timeStart
      output.timeEnd = timeEnd
      output.selectedTime = timeStart + '-' + timeEnd
    }
    if (route[1] && route[2]) {
      output.showResult = true
    }

    //context.error({ statusCode: 404, message: 'Post not found' })

    try {
      return context.$axios.$get(`/cities.json`).then(res => {
        output.ok = 'OK'
        output.cities = res
        output.currentPage = context.route.params[0]
        return output
      })
    } catch (e) {
      return {
        ok: 'Error'
      }
    }
  }
}
</script>

<style>
</style>
