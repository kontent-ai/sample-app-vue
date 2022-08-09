<template>
    <section 
        class="banner-section" 
        v-bind:style="heroUnitData.sectionStyleObject"
    >
        <h2 class="banner-heading">{{heroUnitData.bannerHeading}}</h2>
        <RichTextElement
            v-if="heroUnitData.bannerText"
            class="banner-text"
            :element="heroUnitData.bannerText"
        />
    </section>
</template>

<script>
import { Client } from '../Client.js';
import { initLanguageCodeObject, defaultLanguage } from '../Utilities/LanguageCodes';
import RichTextElement from './RichTextElement.vue';
import _ from 'lodash';

const heroUnits = initLanguageCodeObject();

export default {
  name: 'banner',
  props: ['language'],
  data: () => ({
    heroUnit: null
  }),
  computed:{
    heroUnitData: function() {
      return {
        bannerHeading: _.get(this.heroUnit, 'elements.title.value', this.$t('Banner.loading')),
        bannerText: _.get(this.heroUnit, 'elements.marketingMessage', ''),
        sectionStyleObject: {
          backgroundImage: this.heroUnit ? `url(${this.heroUnit.elements.image.value[0].url})` : undefined,
          backgroundColor: '#B24143'
        }
      }
    }
  },
  watch: {
    language: function(){
      this.fetchHeroUnit();
    }
  },
  methods: {
    fetchHeroUnit: function(){
      var query = Client.items().type('hero_unit').elementsParameter(['hero_unit', 'title', 'image', 'marketing_message']);

      if (this.language) {
        query.languageParameter(this.language);
      }

      query.toPromise()
        .then(response => {
          if (this.language) {
            heroUnits[this.language] = response.data.items;
          } else {
            heroUnits[defaultLanguage] = response.data.items;
          }
          this.heroUnit = heroUnits[this.language][0];
        });
    }
  },
  mounted: function(){
    this.fetchHeroUnit();
  },
  beforeUpdate: function(){
    this.heroUnit = heroUnits[this.language] && heroUnits[this.language][0];
  },
  components: {
    RichTextElement
  }
}
</script>
