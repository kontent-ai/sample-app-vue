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

<script setup>
import { useI18n } from 'vue-i18n';
import { resolveContentLink } from '../Utilities/ContentLinks'
import { computed } from '@vue/reactivity';

const {locale} = useI18n();
const props = defineProps(['brewers', 'filter']);

const filteredBrewers = computed(() => {
  if (props.brewers.length === 0 || !props.filter) {
        return [];
      }

  return props.brewers.filter(brewer => props.filter.matches(brewer));
})

const brewersData = computed(() =>
  filteredBrewers.value.map(brewer => ({
    price: formatPrice(brewer.elements.price.value, locale.value),
    productName: brewer.elements.productName.value,
    link: resolveContentLink({ type: 'brewer', urlSlug: brewer.elements.urlPattern.value }, locale.value),
    hasNoProductStatus: brewer.elements.productStatus.value.length === 0,
    productStatusText: brewer.elements.productStatus.value.map((x) => x.name).join(', '),
    imageLink: brewer.elements.image.value[0].url
  }))
);

const formatPrice = (price, language) => 
  price.toLocaleString(language, {
      style: 'currency',
      currency: 'USD'
    }
  );
</script>