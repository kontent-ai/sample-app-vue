<template>
    <div class="container">
        <BannerComponent :language="language"/>
        <latest-articles :language="language"/>
        <link-button 
            :text="$t('HomeComponent.moreArticles')" 
            :link="`/${language.toLowerCase()}/articles`"
        />
        <our-story/>
        <link-button 
            :text="$t('HomeComponent.aboutLinkText')" 
            :link="`/${language.toLowerCase()}/about`"
        />
        <taste-our-coffee :language="language"/>
        <link-button 
            :text="$t('HomeComponent.cafesLinkText')" 
            :link="`/${language.toLowerCase()}/cafes`"
        />
    </div>
</template>

<script>
import BannerComponent from './BannerComponent'
import LatestArticles from './LatestArticles'
import LinkButton from './LinkButton'
import OurStory from './OurStory'
import TasteOurCoffee from './TasteOurCoffee'

export default {
  name: 'HomeComponent',
  props: ['language'],
  components: {
    BannerComponent,
    LatestArticles,
    LinkButton,
    OurStory,
    TasteOurCoffee,
  },
}
</script>

