<template>
    <div class="product-page row">
        <div class="flex">
            <CoffeeFilter 
                :language="this.language"
                :processings="processings"
                :productStatuses="productStatuses"
                :filter="filter"
                @set-filter="setFilter"
            />
            <Coffees 
                :language="this.language"
                :coffees="coffees"
                :filter="filter"
            />
        </div>
    </div>
</template>

<script>
import { Filter } from '../Utilities/CoffeeFilter'
import CoffeeFilter from './CoffeeFilter.vue'
import Coffees from './Coffees.vue'
import { Client } from '../Client.js';
import { initLanguageCodeObject, defaultLanguage } from '../Utilities/LanguageCodes';

export default {
  name: 'CoffeeStore',
  props: ['language'],
  data: () => ({
    coffees: [],
    processings: [],
    productStatuses: [],
    filter: new Filter()
  }),
  components: {
    CoffeeFilter,
    Coffees
  },
  methods: {
    fetchData: function(language) {
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
          this.coffees = coffeesList[language];
        });
    },
    fetchProcessings: function() {
      Client.taxonomy('processing')
        .toPromise()
        .then(response => {
          this.processings = response.data.taxonomy.terms;
        });     
    },
    fetchProductStatuses: function() {
      Client.taxonomy('product_status')
        .toPromise()
        .then(response => {
          this.productStatuses = response.data.taxonomy.terms;
        });
    },
    setFilter: function (newFilter) {
      this.filter = newFilter
    },
  },
  watch: {
    language: function () {
      this.fetchData(this.language);
      this.fetchProcessings();
      this.fetchProductStatuses();
    }
  },
  mounted: function() {
    this.fetchData(this.language);
    this.fetchProcessings();
    this.fetchProductStatuses();
  }

}
</script>

