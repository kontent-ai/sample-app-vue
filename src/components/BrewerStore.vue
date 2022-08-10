<template>
    <div class="product-page row">
        <div class="flex">
            <BrewerFilter
                :language="language" 
                :manufacturers="manufacturers" 
                :productStatuses="productStatuses"
                :filter="brewerFilter"
                @set-filter="setFilter"
            />
            <Brewers 
                :language="language"
                :brewers="brewers"
                :filter="brewerFilter"
            />
        </div>
    </div>
</template>

<script>
import BrewerFilter  from './BrewerFilter.vue'
import Brewers from './Brewers.vue'
import { Client } from '../Client.js';
import { initLanguageCodeObject, defaultLanguage } from '../Utilities/LanguageCodes';
import { Filter } from '../Utilities/BrewerFilter';

export default {
  name: 'BrewerStore',
  props: ['language'],
  data: () => ({
    brewers: [],
    manufacturers: [],
    productStatuses: [],
    brewerFilter: new Filter(),
  }),
  components: {
    BrewerFilter,
    Brewers
  },
  methods: {
    fetchData: function(language) {
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
          this.brewers = brewersList[language];
        });
    },
    fetchManufacturers: function() {
      Client.taxonomy('manufacturer')
        .toPromise()
        .then(response => {
          this.manufacturers = response.data.taxonomy.terms;
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
      this.brewerFilter = newFilter
    },
  },
  watch: {
    language: function () {
      this.fetchData(this.language);
    }
  },
  mounted: function() {
    this.fetchData(this.language);
    this.fetchManufacturers();
    this.fetchProductStatuses();
  }
}
</script>
