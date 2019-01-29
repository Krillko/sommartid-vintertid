<template>
  <div style="background: lightgreen">
    <input
      :value="setNumber"
      type="number">
    <button @click="change()">RND</button>
  </div>
</template>

<script>
export default {
  name: 'StoreTest1',
  data() {
    return {
      setNumber: 10
    }
  },
  computed: {
    testnumber() {
      return this.$store.state.testnumber.currentnumber
    }
  },
  methods: {
    change() {
      console.log('change')
      this.$store.commit('testnumber/change', 15)
    }
  }
}
</script>
