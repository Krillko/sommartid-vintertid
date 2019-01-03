<template>
  <div>
    vad är bäst / _.vue
    <h2>{{ currentPage }}</h2>
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
    return {
      currentPage: context.route.params[0]
    }
  }
}
</script>

<style>
</style>
