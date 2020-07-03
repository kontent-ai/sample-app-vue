<template>
    <section 
        class="banner-section" 
        v-bind:style="heroUnitData.sectionStyleObject"
    >
        <h2 class="banner-heading">{{heroUnitData.bannerHeading}}</h2>
        <RichTextElement
            v-if="heroUnitData.bannerText.resolveHtml"
            class="banner-text"
            :element="heroUnitData.bannerText"
        />
    </section>
</template>

<script>
import { HomeHeroUnitStore } from '../Stores/HomeHeroUnit';
import RichTextElement from './RichTextElement.vue';
import _ from 'lodash';


export default {
  name: 'banner',
  props: ['language'],
  data: () => ({
    heroUnit: null
  }),
  computed:{
    heroUnitData: function() {
      return {
        bannerHeading: _.get(this.heroUnit, 'title.value', this.$t('Banner.loading')),
        bannerText: _.get(this.heroUnit, 'marketingMessage', ''),
        sectionStyleObject: {
          backgroundImage: this.heroUnit ? `url(${this.heroUnit.image.value[0].url})` : undefined,
          backgroundColor: '#B24143'
        }
      }
    }
  },
  watch: {
    language: function(){
      HomeHeroUnitStore.provideHomeHeroUnits(this.language);
    }
  },
  methods: {
    onChange: function(){
      this.heroUnit = HomeHeroUnitStore.getFirstHomeHeroUnit(this.language);
    }
  },
  mounted: function(){
    HomeHeroUnitStore.subscribe();
    HomeHeroUnitStore.addChangeListener(this.onChange);
    HomeHeroUnitStore.provideHomeHeroUnits(this.language);
    this.heroUnit = HomeHeroUnitStore.getFirstHomeHeroUnit(this.language);
  },
  beforeUpdate: function(){
    this.heroUnit = HomeHeroUnitStore.getFirstHomeHeroUnit(this.language);
  },
  beforeDestroy: function() {
    HomeHeroUnitStore.unsubscribe();
  },
  destroyed: function(){
    HomeHeroUnitStore.removeChangeListener(this.onChange);
  },
  components: {
    RichTextElement
  }
}
</script>
