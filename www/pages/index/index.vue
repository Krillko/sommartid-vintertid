<template>
  <div>
    <h1>/index/index.vue</h1>
    <nuxt-child/>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {}
  },
  async asyncData(context) {
    // called every time before loading the component
    // as the name said, it can be async
    // Also, the returned object will be merged with your data object
    //console.log(context)

    return {
      lorem: 'ipsum'
    }
  },
  computed: {},
  watch: {},
  methods: {}
}
</script>

<style>
</style>
