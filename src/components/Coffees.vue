<template>
    <div
        id="product-list"
        class="col-md-8 col-lg-9 product-list"
    >
        <div
            v-for="(coffee, index) in coffeesData"
            class="col-md-6 col-lg-4"
            :key="index"
        >
            <article class="product-tile">
                <router-link :to="coffee.link">
                    <h1 class="product-heading">{{coffee.name}}</h1>
                    <span v-if="coffee.hasNoProductStatus"/>
                    <span
                        v-else
                        class="product-tile-status"
                    >
                        {{coffee.productStatusText}}
                    </span>
                    <figure class="product-tile-image">
                        <img
                            :alt="coffee.name"
                            class=""
                            :src="coffee.imageLink"
                            :title="coffee.name"
                        />
                    </figure>
                    <div class="product-tile-info">
                        <span class="product-tile-price">
                            {{coffee.price}}
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
  name: 'Coffees',
  props: ['language', 'coffees', 'filter'],
  computed: {
    filteredCoffees: function () {
      if (this.coffees.length === 0 || !this.filter) {
        return [];
      }
      return this.coffees.filter(coffee => this.filter.matches(coffee));
    },
    coffeesData: function () {
      return this.filteredCoffees.map(coffee => ({
        price: this.formatPrice(coffee.elements.price.value, this.language),
        name: coffee.elements.productName.value,
        imageLink: coffee.elements.image.value[0].url,
        link: resolveContentLink({ type: 'coffee', urlSlug: coffee.elements.urlPattern.value }, this.language),
        hasNoProductStatus: coffee.elements.productStatus.value.length === 0,
        productStatusText: coffee.elements.productStatus.value.map(x => x.name).join(', ')
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
  },
}
</script>