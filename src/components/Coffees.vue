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

<script setup lang="ts">
import type { Coffee } from '@/models';
import { Filter } from '@/Utilities/CoffeeFilter';
import { computed } from '@vue/reactivity';
import { useI18n } from 'vue-i18n';
import { resolveContentLink } from '../Utilities/ContentLinks'

interface CoffeesData {
  price: string,
  name: string,
  imageLink: string,
  link: string,
  hasNoProductStatus: boolean,
  productStatusText: string
}

const props = defineProps<{
  coffees: Array<Coffee>,
  filter: Filter
}>();

const { locale } = useI18n();

const filteredCoffees = computed<Array<Coffee>>(() => {
  if(props.coffees.length === 0 || !props.filter)
  {
    return []
  }

  return props.coffees.filter(coffee => props.filter.matches(coffee));
});

const coffeesData = computed<Array<CoffeesData>>(() => filteredCoffees.value.map(coffee => ({
  price: formatPrice(coffee.elements.price.value, locale.value),
  name: coffee.elements.productName.value,
  imageLink: coffee.elements.image.value[0].url,
  link: resolveContentLink(
    { 
      type: 'coffee', 
      urlSlug: coffee.elements.urlPattern.value,
      codename: "",
      linkId: "" 
    }, 
    locale.value),
  hasNoProductStatus: coffee.elements.productStatus.value.length === 0,
  productStatusText: coffee.elements.productStatus.value.map(x => x.name).join(', ')
  }))
);

const formatPrice = (price: number | null, language: string): string => {
  return price?.toLocaleString(language, {
    style: 'currency',
    currency: 'USD'
  }) ?? '';
}

</script>