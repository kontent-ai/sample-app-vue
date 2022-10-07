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

<script setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Client } from '../Client.js';
import { initLanguageCodeObject, defaultLanguage } from '../Utilities/LanguageCodes';

const { locale, t } = useI18n();
const language = locale.value
let cafes = []
const cafesData = ref([]);
const cafesLink = `${language}/cafes`

const fetchCafes = () => {
  const cafesList = initLanguageCodeObject();

  let query = Client.items()
    .type('cafe')
    .orderParameter('elements.name', 'desc');

  if (language) {
    query.languageParameter(language);
  }

  query.toPromise()
    .then(response => {
      if (language) {
        cafesList[language] = response.data.items;
      } else {
        cafesList[defaultLanguage] = response.data.items;
      }
      cafes = language ? 
        cafesList[language].filter((cafe) => cafe.elements.country.value === 'USA') :
        cafesList[defaultLanguage].filter((cafe) => cafe.elements.country.value === 'USA');
      cafesData.value = cafes.map(cafe => ({
        name: cafe.system.name,
        imageLink: cafe.elements.photo.value[0].url,
      }))
    });

  }

  onMounted(() => {
    fetchCafes();
  })
  // watch: {
  //   language: function(){
  //     this.fetchCafes();
  //   }
  // },
    
</script>
