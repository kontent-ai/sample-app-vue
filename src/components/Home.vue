<!--TODO extract to 'page' component, write in pug, not html - demonstrates vue?-->
<template>
    <div class="container">
        <Banner/>
        <latest-articles :language="language"/>
        <link-button :text="t('moreArticles')" :link="`/${language}/articles`"/>
        <our-story/>
        <!--TODO en-us resolve for spanish-->
        <link-button :text="t('aboutLinkText')" :link="`/${language}/about`"/>
        <taste-our-coffee :language="language"/>
        <link-button :text="t('cafesLinkText')" :link="`/${language}/cafes`"/>
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
        locales: {
            'en-US': en.Home,
            'es-ES': es.Home
        }
    }
</script>

