<template>
    <div
        id="product-list"
        class="col-md-8 col-lg-9 product-list"
    >
        <div
            v-for="(brewer, index) in brewersData"
            class="col-md-6 col-lg-4"
            :key="index"
        >
            <article class="product-tile">
                <router-link :to="brewer.link">
                    <h1 class="product-heading">{{brewer.productName}}</h1>
                    <span v-if="brewer.hasNoProductStatus"/>
                    <span
                        v-else
                        class="product-tile-status"
                    >
                        {{brewer.productStatusText}}
                    </span>
                    <figure class="product-tile-image">
                        <img
                            v-bind:alt="brewer.productName"
                            class=""
                            v-bind:src="brewer.imageLink"
                            v-bind:title="brewer.productName"
                        />
                    </figure>
                    <div class="product-tile-info">
                        <span class="product-tile-price">
                            {{brewer.price}}
                        </span>
                    </div>
                </router-link>
            </article>
        </div>
    </div>
</template>

<script>
import { BrewerStore } from '../Stores/Brewer'
import { resolveContentLink } from '../Utilities/ContentLinks'

export default {
  name: 'Brewers',
  props: ['language'],
  data: () => ({
    brewers: [],
    filter: null,
  }),
  computed: {
    filteredBrewers: function () {
      if (this.brewers.length === 0 || !this.filter) {
        return [];
      }
      return this.brewers.filter(brewer => this.filter.matches(brewer));
    },
    brewersData: function () {
      return this.filteredBrewers.map(brewer => ({
        price: this.formatPrice(brewer.price.value, this.language),
        productName: brewer.productName.value,
        link: resolveContentLink({ type: 'brewer', urlSlug: brewer.urlPattern.value }, this.language),
        hasNoProductStatus: brewer.productStatus.value.length === 0,
        productStatusText: brewer.productStatus.value.map((x) => x.name).join(', '),
        imageLink: brewer.image.value[0].url
      }))
    }
  },
  watch: {
    language: function () {
      BrewerStore.provideBrewers(this.language);
    }
  },
  methods: {
    formatPrice: function (price, language) {
      return price.toLocaleString(language, {
        style: 'currency',
        currency: 'USD'
      });
    },
    resolveContentLink,
    onChange: function () {
      this.brewers = BrewerStore.getBrewers(this.language);
      this.filter = BrewerStore.getFilter();
    }
  },
  created: function () {
    BrewerStore.addChangeListener(this.onChange);
    BrewerStore.provideBrewers(this.language);
    this.brewers = BrewerStore.getBrewers(this.language);
    this.filter = BrewerStore.getFilter();
  },
  beforeDestroy: function() {
    BrewerStore.unsubscribe();
  },
  destroyed: function () {
    BrewerStore.removeChangeListener(this.onChange);
  }
}
</script>