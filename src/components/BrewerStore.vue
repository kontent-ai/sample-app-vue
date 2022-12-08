<template>
  <div class="product-page row">
    <div class="flex">
      <BrewerFilter
        :manufacturers="manufacturers"
        :productStatuses="productStatuses"
        :filter="brewerFilter"
        @set-filter="setFilter"
      />
      <Brewers :brewers="brewers" :filter="brewerFilter" />
    </div>
  </div>
</template>

<script setup lang="ts">
import BrewerFilter from './BrewerFilter.vue';
import Brewers from './Brewers.vue';
import { Client } from '../Client.js';
import {
  defaultLanguage,
  initLanguageCodeObjectWithArray,
} from '../Utilities/LanguageCodes';
import { Filter } from '../Utilities/BrewerFilter';
import { useI18n } from 'vue-i18n';
import { onMounted, ref, watch } from 'vue';
import type { Brewer } from '@/models';
import type { ITaxonomyTerms } from '@kontent-ai/delivery-sdk';

const { locale } = useI18n();

const brewers = ref<Array<Brewer>>([]);
const manufacturers = ref<Array<ITaxonomyTerms>>([]);
const productStatuses = ref<Array<ITaxonomyTerms>>([]);
const brewerFilter = ref<Filter>(new Filter());

const fetchData = (language: string): void => {
  const brewersList = initLanguageCodeObjectWithArray<Brewer>();
  var query = Client.items<Brewer>()
    .type('brewer')
    .orderParameter('elements.product_name', 'desc');

  if (language) {
    query.languageParameter(language);
  }

  query.toPromise().then((response) => {
    if (language) {
      brewersList[language] = response.data.items;
    } else {
      brewersList[defaultLanguage] = response.data.items;
    }
    brewers.value = brewersList[language];
  });
};

const fetchManufacturers = (): void => {
  Client.taxonomy('manufacturer')
    .toPromise()
    .then((response) => {
      manufacturers.value = response.data.taxonomy.terms;
    });
};

const fetchProductStatuses = (): void => {
  Client.taxonomy('product_status')
    .toPromise()
    .then((response) => {
      productStatuses.value = response.data.taxonomy.terms;
    });
};

const setFilter = (newFilter: Filter): void => {
  brewerFilter.value = newFilter;
};

onMounted(() => {
  fetchData(locale.value);
  fetchManufacturers();
  fetchProductStatuses();
});

watch(locale, () => {
  fetchData(locale.value);
});
</script>
