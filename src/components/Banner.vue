<template>
    <section 
        class="banner-section" 
        v-bind:style="heroUnitData?.sectionStyleObject"
    >
        <h2 class="banner-heading">{{heroUnitData?.bannerHeading}}</h2>
        <RichTextElement
            v-if="heroUnitData?.bannerText"
            class="banner-text"
            :element="heroUnitData?.bannerText"
        />
    </section>
</template>

<script setup>
import { Client } from '../Client.js';
import { initLanguageCodeObject, defaultLanguage } from '../Utilities/LanguageCodes';
import RichTextElement from './RichTextElement.vue';
import _ from 'lodash';
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n'
import { computed } from '@vue/reactivity';

const props = defineProps(['language']);
const { t, locale } =  useI18n();

const heroUnit = ref(null);
const heroUnitData = computed(() => {
  if (!heroUnit.value){
    return null;
  }

  return {
    bannerHeading: _.get(heroUnit.value, 'elements.title.value', t('Banner.loading')),
    bannerText: _.get(heroUnit.value, 'elements.marketingMessage', ''),
    sectionStyleObject: {
      backgroundImage: heroUnit ? `url(${heroUnit.value.elements.image.value[0].url})` : undefined,
      backgroundColor: '#B24143'
    }
  }
})

const fetchHeroUnit = () => {
  const heroUnits = initLanguageCodeObject();
  var query = Client.items().type('hero_unit').elementsParameter(['title', 'image', 'marketing_message']);
  
  if (locale.value) {
    query.languageParameter(locale.value);
  }

  query.toPromise()
    .then(response => {
      if (locale.value) {
        heroUnits[locale.value] = response.data.items;
      } else {
        heroUnits[defaultLanguage] = response.data.items;
      }
      heroUnit.value = heroUnits[locale.value][0];
    });
}

onMounted(() => {
  fetchHeroUnit();
})

watch(locale, () => {
  fetchHeroUnit();
})
</script>
