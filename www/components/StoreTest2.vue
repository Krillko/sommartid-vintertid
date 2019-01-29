<template>
  <div style="background: lightcoral">
    {{ testnumber }}
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
  }
}
</script>
