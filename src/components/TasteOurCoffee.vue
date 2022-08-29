<template>
    <div class="row">
        <div>
            <h1 class="title-tab">{{$t('TasteOurCoffee.title')}}</h1>
        </div>
        <div
            v-for="(cafe, index) in cafesData"
            class="col-xs-6 col-md-3"
            :key="index"
        >
            <div>
                <router-link
                    :to="cafesLink"
                    class="ourcoffee-tile-link"
                >
                    <h2 class="ourcoffee-tile-text center-text">{{cafe.name}}</h2>
                    <span class="cafe-overlay"> </span>
                    <img
                        v-bind:alt="cafe.name"
                        class="ourcoffee-tile-image"
                        v-bind:src="cafe.imageLink"
                        v-bind:title="cafe.name"
                    />
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import { Client } from '../Client.js';
import { initLanguageCodeObject, defaultLanguage } from '../Utilities/LanguageCodes';

export default {
  name: 'taste-our-coffee',
  props: ['language'],
  data: function () {
    return {
      cafes: [],
      cafesLink: `${this.language}/cafes`,
    }
  },
  computed: {
    cafesData: function(){
      return this.cafes.map(cafe => ({
        name: cafe.system.name,
        imageLink: cafe.elements.photo.value[0].url,
      }))
    },
  },
  watch: {
    language: function(){
      this.fetchCafes();
    }
  },
  methods: {
    fetchCafes() {
      const cafesList = initLanguageCodeObject();

      let query = Client.items()
        .type('cafe')
        .orderParameter('elements.name', 'desc');

      if (this.language) {
        query.languageParameter(this.language);
      }

      query.toPromise()
        .then(response => {
          if (this.language) {
            cafesList[this.language] = response.data.items;
          } else {
            cafesList[defaultLanguage] = response.data.items;
          }
          this.cafes = this.language ? 
            cafesList[this.language].filter((cafe) => cafe.elements.country.value === 'USA') :
            cafesList[defaultLanguage].filter((cafe) => cafe.elements.country.value === 'USA');
        });
    }
  },
  mounted: function() {
    this.fetchCafes();
  },
}
</script>
