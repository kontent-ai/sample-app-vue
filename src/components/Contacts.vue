<template>
  <div class="container">
    <div class="col-md-12">
      <h2 class="contact-title">{{ $t('Contacts.roasteryTitle') }}</h2>
      <ul v-if="firstCafe" class="contact-info">
        <li>{{ firstCafe.phone }}</li>
        <li>
          <a :href="'mailto:' + firstCafe.email" target="_top">{{
            firstCafe.email
          }}</a>
        </li>
        <li>
          <p
            @click="handleRoasteryClick"
            :data-address="firstCafe.dataAddress"
            class="js-scroll-to-map"
          >
            {{ firstCafe.dataAddress }},<br />
            {{ firstCafe.zipCode }}, {{ firstCafe.countryWithState }}<br />
          </p>
        </li>
      </ul>
    </div>
    <div>
      <h2>{{ $t('Contacts.ourCafesTitle') }}</h2>
      <div class="row">
        <div
          v-for="(model, index) in cafeModels"
          class="col-md-6 col-lg-3"
          :key="index"
        >
          <div
            @click="handleAddressClick(model)"
            class="cafe-tile cursor-hand js-scroll-to-map"
            :data-address="model.dataAddress"
          >
            <div class="cafe-tile-content">
              <h3 class="cafe-tile-name">{{ model.name }}</h3>
              <address class="cafe-tile-address">
                <p :name="model.name" class="cafe-tile-address-anchor">
                  {{ model.street }}, {{ model.city }}<br />{{ model.zipCode }},
                  {{ model.countryWithState }}
                </p>
              </address>
              <p>{{ model.phone }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import VueScrollTo from 'vue-scrollto';

import type { Cafe } from '@/models';
import { getCafeModel } from '@/Utilities/CafeListing';
import type { CafeModel } from '@/ViewModels/CafeModel';

import { defaultLanguage, initLanguageCodeObjectWithArray } from '../Utilities/LanguageCodes'
import { injectClient } from '@/Utilities/Symbols';


const Client = injectClient();
const { locale } = useI18n();

const cafes = ref<Array<Cafe>>([]);
const selectedAddress = ref<string | null>(null);

const cafeModels = computed(() => cafes.value.map((cafe) => getCafeModel(cafe)));

const firstCafe = computed<CafeModel | null>(() => {
  if (cafes.value.length === 0) {
    return null;
  }

  return getCafeModel(cafes.value[0]);
});

const handleRoasteryClick = (): void => {
  if (selectedAddress.value === firstCafe.value?.dataAddress) {
    VueScrollTo.scrollTo('#map');
    return;
  }

  selectedAddress.value = firstCafe.value?.dataAddress ?? '';
};

const handleAddressClick = (model: CafeModel): void => {
  if (selectedAddress.value === model.dataAddress) {
    VueScrollTo.scrollTo('#map');
    return;
  }
  selectedAddress.value = model.dataAddress;
};

const fetchCafes = () => {
  const cafesList = initLanguageCodeObjectWithArray<Cafe>();

  const query = Client.value.items<Cafe>()
    .type('cafe')
    .orderParameter('elements.name', 'desc');

  if (locale.value) {
    query.languageParameter(locale.value);
  }

  query.toPromise().then((response) => {
    if (locale.value) {
      cafesList[locale.value] = response.data.items;
    } else {
      cafesList[defaultLanguage] = response.data.items;
    }
    cafes.value = locale.value
      ? cafesList[locale.value].filter(
          (cafe) => cafe.elements.country.value === 'USA'
        )
      : cafesList[defaultLanguage].filter(
          (cafe) => cafe.elements.country.value === 'USA'
        );
  });
};

onMounted(() => fetchCafes());

watch(locale, () => {
  fetchCafes();
});
</script>
