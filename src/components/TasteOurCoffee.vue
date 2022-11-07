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
import { computed } from '@vue/reactivity';
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { Client } from '../Client.js';
import { initLanguageCodeObject, defaultLanguage } from '../Utilities/LanguageCodes';

const { locale, t } = useI18n();
const cafes = ref([]);
const cafesData = computed(() => cafes.value.map(cafe => ({
  name: cafe.system.name,
  imageLink: cafe.elements.photo.value[0].url,
})));
const cafesLink = `${locale.value}/cafes`

const fetchCafes = () => {
  const cafesList = initLanguageCodeObject();

  let query = Client.items()
    .type('cafe')
    .orderParameter('elements.name', 'desc');

  if (locale.value) {
    query.languageParameter(locale.value);
  }

  query.toPromise()
    .then(response => {
      if (locale.value) {
        cafesList[locale.value] = response.data.items;
      } else {
        cafesList[defaultLanguage] = response.data.items;
      }
      cafes.value = locale.value ? 
        cafesList[locale.value].filter((cafe) => cafe.elements.country.value === 'USA') :
        cafesList[defaultLanguage].filter((cafe) => cafe.elements.country.value === 'USA');
    });
  }

onMounted(() => {
  fetchCafes();
})

watch(locale, () => {
  fetchCafes();
}); 
</script>
