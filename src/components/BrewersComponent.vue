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
import { resolveContentLink } from '../Utilities/ContentLinks'

export default {
  name: 'BrewersComponent',
  props: ['language', 'brewers', 'filter'],
  data: () => ({
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
        price: this.formatPrice(brewer.elements.price.value, this.language),
        productName: brewer.elements.productName.value,
        link: resolveContentLink({ type: 'brewer', urlSlug: brewer.elements.urlPattern.value }, this.language),
        hasNoProductStatus: brewer.elements.productStatus.value.length === 0,
        productStatusText: brewer.elements.productStatus.value.map((x) => x.name).join(', '),
        imageLink: brewer.elements.image.value[0].url
      }))
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
      
    }
  },
  mounted: function () {
    this.onChange();
  },
}
</script>