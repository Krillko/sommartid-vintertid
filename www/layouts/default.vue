<template>
  <div class="e-defaultTemplate">
    <nav>
      <nuxt-link to="/vad-är-bäst/i-stockholm">Link 1</nuxt-link>
      <nuxt-link to="/vad-är-bäst/i-stockholm/ljust-på-kvällen">Link 2</nuxt-link>
      <nuxt-link to="/vad-är-bäst/i-malmö">Link 3</nuxt-link>
      <button @click="goToPage">Programmaticly go</button>
    </nav>
    <nuxt/>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      lorem: 'ipsum'
    }
  },
  methods: {
    goToPage: function() {
      console.log('go to page')
      this.$router.push({ path: '/vad-är-bäst/i-piteå' })
    }
  }
}
</script>

<style/>
