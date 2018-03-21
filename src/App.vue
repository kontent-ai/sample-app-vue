<template>
    <div id="app">
        <Header :language="language" :changeLang="changeLang"/>
        <router-view :language="language"/>
        <Footer :language="language"/>
    </div>
</template>

<script>
    import Header from './components/Header.vue'
    import Footer from './components/Footer.vue'
    import {languageCodes, languageCodesLowerCase} from './Utilities/LanguageCodes'

    export default {
        name: 'app',
        computed: {
            language: function() {
                this.$translate.setLang(this.$translate.lang);
                return this.$translate.lang;
            },
        },
        components: {
            Header,
            Footer,
        },
        methods: {
            changeLang: function(newLanguage){
                if (this.language === newLanguage || languageCodes.indexOf(newLanguage) < 0) {
                    return;
                }

                const urlParts = this.$route.path.split('/');
                const currentLanguage = this.$route.path.split('/')[1];
                if (languageCodesLowerCase.indexOf(currentLanguage.toLocaleLowerCase()) > -1) {
                    urlParts[1] = newLanguage;
                } else {
                    urlParts.splice(1, 0, newLanguage)
                }
                this.$router.push(urlParts.join('/'));
                this.$translate.setLang(newLanguage);
            }
        },
        created: function(){
            this.$translate.setLang('en-US');
        }
    }
</script>
