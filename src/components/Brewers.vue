<template>
  <div id="product-list" class="col-md-8 col-lg-9 product-list">
    <div
      v-for="(brewer, index) in brewersData"
      class="col-md-6 col-lg-4"
      :key="index"
    >
      <article class="product-tile">
        <router-link :to="brewer.link">
          <h1 class="product-heading">{{ brewer.productName }}</h1>
          <span v-if="brewer.hasNoProductStatus" />
          <span v-else class="product-tile-status">
            {{ brewer.productStatusText }}
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
              {{ brewer.price }}
            </span>
          </div>
        </router-link>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { useI18n } from 'vue-i18n';

import type { Brewer } from '@/models';
import { Filter } from '@/Utilities/BrewerFilter';

import { resolveContentLink } from '../Utilities/ContentLinks';

interface BrewersData {
  price: string;
  productName: string;
  link: string;
  hasNoProductStatus: boolean;
  productStatusText: string;
  imageLink: string;
}

const { locale } = useI18n();
const props = defineProps<{
  brewers: Array<Brewer>;
  filter?: Filter;
}>();

const filteredBrewers = computed<Array<Brewer>>(() => {
  if (props.brewers.length === 0 || !props.filter) {
    return [];
  }

  return props.brewers.filter((brewer) => props.filter?.matches(brewer));
});

const brewersData = computed<Array<BrewersData>>(() =>
  filteredBrewers.value.map((brewer) => ({
    price: formatPrice(brewer.elements.price.value, locale.value),
    productName: brewer.elements.productName.value,
    link: resolveContentLink(
      {
        type: 'brewer',
        urlSlug: brewer.elements.urlPattern.value,
        codename: '',
        linkId: '',
      },
      locale.value
    ),
    hasNoProductStatus: brewer.elements.productStatus.value.length === 0,
    productStatusText: brewer.elements.productStatus.value
      .map((x) => x.name)
      .join(', '),
    imageLink: brewer.elements.image.value[0].url,
  }))
);

const formatPrice = (price: number | null, language: string): string =>
  price?.toLocaleString(language, {
    style: 'currency',
    currency: 'USD',
  }) ?? '';
</script>
