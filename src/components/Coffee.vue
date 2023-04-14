<template>
  <div class="container" v-if="!coffee"></div>
  <div class="container" v-else>
    <article v-if="coffee" class="product-detail">
      <div class="row">
        <div class="col-md-12">
          <header>
            <h2>{{ coffeeData.name }}</h2>
          </header>
        </div>
      </div>
      <div class="row-fluid">
        <div class="col-lg-7 col-md-6">
          <figure class="image">
            <img
              :alt="coffeeData.name"
              class=""
              :src="coffeeData.imageLink"
              :title="coffeeData.name"
            />
          </figure>
          <div class="description">
            <RichTextElement
              v-if="coffeeData.descriptionElement"
              :element="coffeeData.descriptionElement"
            />
            <div class="product-detail-properties">
              <h4>Parameters</h4>
              <dl class="row">
                <dt class="col-xs-12 col-sm-4">Farm</dt>
                <dd class="col-xs-12 col-sm-8">{{ coffeeData.farm }}</dd>
                <dt class="col-xs-12 col-sm-4">Variety</dt>
                <dd class="col-xs-12 col-sm-8">{{ coffeeData.variety }}</dd>
                <dt class="col-xs-12 col-sm-4">Processing</dt>
                <dd class="col-xs-12 col-sm-8">{{ coffeeData.processing }}</dd>
                <dt class="col-xs-12 col-sm-4">Altitude</dt>
                <dd class="col-xs-12 col-sm-8">{{ coffeeData.altitude }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import type { Elements } from '@kontent-ai/delivery-sdk';
import { computed } from '@vue/reactivity';
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import type { Coffee } from '@/models';

import { Client } from '../Client.js';
import { resolveChangeLanguageLink } from '../Utilities/RouterLink';
import RichTextElement from './RichTextElement.vue';

interface CoffeeData {
  name: string;
  imageLink: string;
  descriptionElement: Elements.RichTextElement | null;
  farm: string;
  variety: string;
  processing: string;
  altitude: string;
}

const { locale } = useI18n();
const route = useRoute();
const router = useRouter();
const coffee = ref<Coffee | null>(null);

const coffeeData = computed<CoffeeData>(() => ({
  name: coffee.value?.elements.productName.value ?? '',
  imageLink: coffee.value?.elements.image.value[0].url ?? '',
  descriptionElement: coffee.value?.elements.longDescription ?? null,
  farm: coffee.value?.elements.farm.value ?? '',
  variety: coffee.value?.elements.variety.value ?? '',
  processing:
    coffee.value && coffee.value.elements.processing.value.length > 0
      ? coffee.value.elements.processing.value[0].name
      : '',
  altitude: coffee.value?.elements.altitude.value ? coffee.value.elements.altitude.value + ' feet' : '',
}));

const fetchData = () => {
  const query = Client.items<Coffee>()
    .type('coffee')
    .equalsFilter('url_pattern', route.params.coffeeSlug as string);

  if (locale.value) {
    query.languageParameter(locale.value);
  }

  query.toPromise().then((response) => {
    coffee.value = response.data.items[0];

    if (coffee.value.system.language !== locale.value) {
      router.replace({
        path: resolveChangeLanguageLink(
          route.path,
          coffee.value.system.language
        ),
      });
    }
  });
};

onMounted(() => {
  fetchData();
});

watch(locale, () => {
  fetchData();
});
</script>
