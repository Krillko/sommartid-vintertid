<template>
  <div>
    <h1>/index/index/_.vue</h1>
    <h2>{{ currentPage }}</h2>
    <h2>{{ ok }}</h2>
  </div>
</template>

<script>
export default {
  components: {},
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

    try {
      return context.$axios.$get(`/cities.json`).then(res => {
        return {
          ok: 'Ok',
          currentPage: context.route.params[0],
          cities: res
        }
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
