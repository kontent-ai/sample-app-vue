<template>
    <div class="product-page row">
        <div class="flex">
            <BrewerFilter 
                :manufacturers="manufacturers" 
                :productStatuses="productStatuses"
                :filter="brewerFilter"
                @set-filter="setFilter"
            />
            <Brewers 
                :brewers="brewers"
                :filter="brewerFilter"
            />
        </div>
    </div>
</template>

<script setup>
import BrewerFilter  from './BrewerFilter.vue'
import Brewers from './Brewers.vue'
import { Client } from '../Client.js';
import { initLanguageCodeObject, defaultLanguage } from '../Utilities/LanguageCodes';
import { Filter } from '../Utilities/BrewerFilter';
import { useI18n } from 'vue-i18n';
import {onMounted, ref} from 'vue';

const { locale } = useI18n();
const language = locale.value;

const brewers = ref([]);
const manufacturers = ref([]);
const productStatuses = ref([]);
const brewerFilter = ref(new Filter());

const fetchData = (language) => {
  const brewersList = initLanguageCodeObject();
  var query = Client.items()
    .type('brewer')
    .orderParameter('elements.product_name', 'desc');

  if (language) {
    query.languageParameter(language);
  }

  query.toPromise()
    .then(response => {
      if (language) {
        brewersList[language] = response.data.items;
      } else {
        brewersList[defaultLanguage] = response.data.items;
      }
      brewers.value = brewersList[language];
    });
}

const fetchManufacturers = () => {
  Client.taxonomy('manufacturer')
    .toPromise()
    .then(response => {
      manufacturers.value = response.data.taxonomy.terms;
    });
}

const fetchProductStatuses = () => {
  Client.taxonomy('product_status')
    .toPromise()
    .then(response => {
      console.log(response)
      productStatuses.value = response.data.taxonomy.terms;
    });
}

const setFilter = (newFilter) => {
  brewerFilter.value = newFilter
}

  // watch: {
  //   language: function () {
  //     this.fetchData(this.language);
  //   }
  // },
onMounted(() => {
    fetchData(language);
    fetchManufacturers();
    fetchProductStatuses();
  }
)
</script>
