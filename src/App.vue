<template>
  <div id="app">
      <Header/>
      <h1>content</h1>
      <Footer/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'app',
  components: {
      Header,
      Footer,
  }
}
</script>

<style>
</style>
