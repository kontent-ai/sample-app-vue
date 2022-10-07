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
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n'

const heroUnits = initLanguageCodeObject();
const props = defineProps(['language']);
let heroUnit = null;
const heroUnitData = ref(null);

const fetchHeroUnit = () => {
      var query = Client.items().type('hero_unit').elementsParameter(['title', 'image', 'marketing_message']);
      const { t, locale } =  useI18n();

      if (locale) {
        query.languageParameter(locale.value);
      }

      query.toPromise()
        .then(response => {
          if (locale.value) {
            heroUnits[locale.value] = response.data.items;
          } else {
            heroUnits[defaultLanguage] = response.data.items;
          }
          heroUnit = heroUnits[locale.value][0];
          heroUnitData.value = {
            bannerHeading: _.get(heroUnit, 'elements.title.value', t('Banner.loading')),
            bannerText: _.get(heroUnit, 'elements.marketingMessage', ''),
            sectionStyleObject: {
              backgroundImage: heroUnit ? `url(${heroUnit.elements.image.value[0].url})` : undefined,
              backgroundColor: '#B24143'
            }
          }
        });
    }

  onMounted(() => {
    fetchHeroUnit();
  })


  // watch: {
  //   language: function(){
  //     this.fetchHeroUnit();
  //   }
  // },

</script>
