<template>
    <div class="product-page row">
        <div class="flex">
            <CoffeeFilter
                :processings="processings"
                :productStatuses="productStatuses"
                :filter="filter"
                @set-filter="setFilter"
            />
            <Coffees 
                :coffees="coffees"
                :filter="filter"
            />
        </div>
    </div>
</template>

<script setup>
import { Filter } from '../Utilities/CoffeeFilter'
import CoffeeFilter from './CoffeeFilter.vue'
import Coffees from './Coffees.vue'
import { Client } from '../Client.js';
import { initLanguageCodeObject, defaultLanguage } from '../Utilities/LanguageCodes';
import { useI18n } from 'vue-i18n';
import { onMounted, ref, watch } from 'vue';

const { locale } = useI18n();
const coffees = ref([]);
const processings = ref([]);
const productStatuses = ref([]);

const filter = ref(new Filter());

const fetchData = (language) => {
  const coffeesList = initLanguageCodeObject();
  var query = Client.items()
    .type('coffee')
    .orderParameter('elements.product_name', 'desc');

  if (language) {
    query.languageParameter(language);
  }

  query.toPromise()
    .then(response => {
      if (language) {
        coffeesList[language] = response.data.items;
      } else {
        coffeesList[defaultLanguage] = response.data.items;
      }
      coffees.value = coffeesList[language];
    });
}

const fetchProcessings = () => {
  Client.taxonomy('processing')
    .toPromise()
    .then(response => {
      processings.value = response.data.taxonomy.terms;
    });     
}

const fetchProductStatuses = () => {
  Client.taxonomy('product_status')
    .toPromise()
    .then(response => {
      productStatuses.value = response.data.taxonomy.terms;
    });
}

const setFilter = (newFilter) => {
  filter.value = newFilter
}

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

