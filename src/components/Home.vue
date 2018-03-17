<!--TODO extract to 'page' component, write in pug, not html - demonstrates vue?-->
<template>
    <div class="container">
        <Banner/>
        <latest-articles :language="this.language"/>
        <link-button text="More articles" :link="`/${this.language}/articles`"/>
        <our-story title="our story" v-bind:text='storyText'/>
        <!--TODO en-us resolve for spanish-->
        <link-button text="Read the whole story" :link="`/${this.language}/about`"/>
        <taste-our-coffee :language="this.language"/>
        <link-button text="Find out more" :link="`/${this.language}/cafes`"/>
    </div>
</template>

<script>
    import Banner from './Banner'
    import LatestArticles from './LatestArticles'
    import LinkButton from './LinkButton'
    import OurStory from './OurStory'
    import TasteOurCoffee from './TasteOurCoffee'

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
        //TODO where to keep this story text? Fetch?
        data: () => ({
            storyText: "At Dancing Goat, we strive to do things right. Not only do we source the best coffees you can get your hands on. We also make sure we have a direct relationship with our farmers. Visiting the micro farms where we source our coffees is our daily bread. This way, we can guarantee the highest quality standard all year long. No middle-men, no unfair shares. Our farmers get the best deal possible. So do you.",

        }),
    }
</script>

