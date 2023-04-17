<template>
  <div class="product-page row">
    <div class="flex">
      <CoffeeFilter
        :processings="processings"
        :productStatuses="productStatuses"
        :filter="filter"
        @set-filter="setFilter"
      />
      <Coffees :coffees="coffees" :filter="filter" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ITaxonomyTerms } from '@kontent-ai/delivery-sdk';
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import type { Coffee } from '@/models';
import { ClientKey,injectStrict } from '@/Utilities/Symbols';

import { Filter } from '../Utilities/CoffeeFilter';
import { defaultLanguage, initLanguageCodeObjectWithArray } from '../Utilities/LanguageCodes'
import CoffeeFilter from './CoffeeFilter.vue';
import Coffees from './Coffees.vue';

const Client = injectStrict(ClientKey);

const { locale } = useI18n();
const coffees = ref<Array<Coffee>>([]);
const processings = ref<Array<ITaxonomyTerms>>([]);
const productStatuses = ref<Array<ITaxonomyTerms>>([]);
const filter = ref<Filter>(new Filter());

const fetchData = (language: string) => {
  const coffeesList = initLanguageCodeObjectWithArray<Coffee>();
  const query = Client.value.items<Coffee>()
    .type('coffee')
    .orderParameter('elements.product_name', 'desc');

  if (language) {
    query.languageParameter(language);
  }

  query.toPromise().then((response) => {
    if (language) {
      coffeesList[language] = response.data.items;
    } else {
      coffeesList[defaultLanguage] = response.data.items;
    }
    coffees.value = coffeesList[language];
  });
};

const fetchProcessings = (): void => {
  Client.value.taxonomy('processing')
    .toPromise()
    .then((response) => {
      processings.value = response.data.taxonomy.terms;
    });
};

const fetchProductStatuses = (): void => {
  Client.value.taxonomy('product_status')
    .toPromise()
    .then((response) => {
      productStatuses.value = response.data.taxonomy.terms;
    });
};

const setFilter = (newFilter: Filter): void => {
  filter.value = newFilter;
};

watch(locale, () => {
  fetchData(locale.value);
  fetchProcessings();
  fetchProductStatuses();
});

onMounted(() => {
  fetchData(locale.value);
  fetchProcessings();
  fetchProductStatuses();
});
</script>
