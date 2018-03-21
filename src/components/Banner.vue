<template>
    <section class="banner-section" v-bind:style="sectionStyleObject">
        <h2 class="banner-heading">{{t('heading')}}</h2>
        <p class="banner-text">
            {{t('text')}}
        </p>
    </section>
</template>

<script>
    import BackgroundImage from '../Images/banner-default.jpg';
    import VueTranslate from 'vue-translate-plugin'
    import * as en from '../Localization/en-US.json'
    import * as es from '../Localization/es-ES.json'

    export default {
        name: "Banner",
        data: () => ({
            sectionStyleObject: {
                backgroundImage: "url(" + BackgroundImage + ")",
            },
        }),
        created: function () {
            this.$translate.setLocales({
                'en-US': en.Banner,
                'es-ES': es.Banner
            })
        }
    }
</script>

