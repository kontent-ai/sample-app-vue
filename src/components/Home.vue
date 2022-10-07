<template>
    <div class="container">
        <Banner :language="language"/>

        <LatestArticles :language="language"/>
        <LinkButton
            :text="$t('Home.moreArticles')" 
            :link="`/${language.toLowerCase()}/articles`"
        />
        <OurStory/>
        <LinkButton 
            :text="$t('Home.aboutLinkText')" 
            :link="`/${language.toLowerCase()}/about`"
        />
        <TasteOurCoffee :language="language"/>
        <LinkButton 
            :text="$t('Home.cafesLinkText')" 
            :link="`/${language.toLowerCase()}/cafes`"
        />
    </div>
</template>

<script setup>
import LinkButton from './LinkButton.vue'
import OurStory from './OurStory.vue'
import Banner from './Banner.vue'
import LatestArticles from './LatestArticles.vue'
import TasteOurCoffee from './TasteOurCoffee.vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n();
const language = locale.value;

</script>

