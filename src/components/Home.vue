<template>
  <div class="container">
    <Banner />

    <LatestArticles />
    <LinkButton
      :text="$t('Home.moreArticles')"
      :link="latestArticlesLink"
    />
    <OurStory />
    <LinkButton
      :text="$t('Home.aboutLinkText')"
      :link="ourStoryLink"
    />
    <TasteOurCoffee />
    <LinkButton
      :text="$t('Home.cafesLinkText')"
      :link="tasterOurCoffeeLink"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import Banner from './Banner.vue';
import LatestArticles from './LatestArticles.vue';
import LinkButton from './LinkButton.vue';
import OurStory from './OurStory.vue';
import TasteOurCoffee from './TasteOurCoffee.vue';

const { locale } = useI18n();
const latestArticlesLink = computed(
  () => `/${locale.value.toLowerCase()}/articles`
);
const ourStoryLink = computed(() => `/${locale.value.toLowerCase()}/about`);
const tasterOurCoffeeLink = computed(
  () => `/${locale.value.toLowerCase()}/cafes`
);
</script>
