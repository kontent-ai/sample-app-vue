<template>
    <div id="app">
        <Header :language="language" />
        <router-view :language="language"/>
        <Footer :language="language"/>
    </div>
</template>

<script>
    import Header from './components/Header.vue'
    import Footer from './components/Footer.vue'

    export default {
        name: 'app',
        computed: {
            language: function() {
                return this.$route.params.lang;
            },
        },
        components: {
            Header,
            Footer,
        }
    }
</script>
