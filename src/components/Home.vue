<!--TODO extract to 'page' component, write in pug, not html - demonstrates vue?-->
<template>
    <div class="container">
        <Banner/>
        <latest-articles :language="this.language"/>
        <link-button :text="this.t('moreArticles')" :link="`/${this.language}/articles`"/>
        <our-story/>
        <!--TODO en-us resolve for spanish-->
        <link-button :text="this.t('aboutLinkText')" :link="`/${this.language}/about`"/>
        <taste-our-coffee :language="this.language"/>
        <link-button :text="this.t('cafesLinkText')" :link="`/${this.language}/cafes`"/>
    </div>
</template>

<script>
    import Banner from './Banner'
    import LatestArticles from './LatestArticles'
    import LinkButton from './LinkButton'
    import OurStory from './OurStory'
    import TasteOurCoffee from './TasteOurCoffee'
    import * as en from '../Localization/en-US.json'
    import * as es from '../Localization/es-ES.json'


    export default {
        name: "Home",
        components: {
            Banner,
            LatestArticles,
            LinkButton,
            OurStory,
            TasteOurCoffee,
        },
        props: ['language'],
        created: function(){
            //TODO mistake in spanish, two headers identical
            this.$translate.setLocales({
                'en-US': en.Home,
                'es-ES': es.Home
            })
        }
    }
</script>

