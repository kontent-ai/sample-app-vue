<template>
  <section
    class="banner-section"
    v-bind:style="heroUnitData?.sectionStyleObject"
  >
    <h2 class="banner-heading">{{ heroUnitData?.bannerHeading }}</h2>
    <RichTextElement
      v-if="heroUnitData"
      class="banner-text"
      :element="heroUnitData?.bannerText"
    />
  </section>
</template>

<script setup lang="ts">
import { Client } from '../Client.js';
import {
  defaultLanguage,
  initLanguageCodeObjectWithArray,
} from '../Utilities/LanguageCodes';
import RichTextElement from './RichTextElement.vue';
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { computed } from '@vue/reactivity';
import type { HeroUnit } from '@/models';
import type { Elements } from '@kontent-ai/delivery-sdk';

interface HeroUnitData {
  bannerHeading: string;
  bannerText: Elements.RichTextElement;
  sectionStyleObject: {
    backgroundImage: string | undefined;
    backgroundColor: string;
  };
}

const { t, locale } = useI18n();

const heroUnit = ref<HeroUnit | null>(null);
const heroUnitData = computed<HeroUnitData | null>(() => {
  if (heroUnit.value === null) {
    return null;
  }

  return {
    bannerHeading: heroUnit.value?.elements.title.value ?? t('Banner.loading'),
    bannerText: heroUnit.value?.elements.marketingMessage ?? 'Loading',
    sectionStyleObject: {
      backgroundImage: heroUnit.value
        ? `url(${heroUnit.value.elements.image.value[0].url})`
        : undefined,
      backgroundColor: '#B24143',
    },
  };
});

const fetchHeroUnit = () => {
  const heroUnits = initLanguageCodeObjectWithArray<HeroUnit>();
  var query = Client.items<HeroUnit>()
    .type('hero_unit')
    .elementsParameter(['title', 'image', 'marketing_message']);

  if (locale.value) {
    query.languageParameter(locale.value);
  }

  query.toPromise().then((response) => {
    if (locale.value) {
      heroUnits[locale.value] = response.data.items;
    } else {
      heroUnits[defaultLanguage] = response.data.items;
    }
    heroUnit.value = heroUnits[locale.value][0];
  });
};

onMounted(() => {
  fetchHeroUnit();
});

watch(locale, () => {
  fetchHeroUnit();
});
</script>
