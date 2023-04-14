<template>
  <div class="container">
    <h2>{{ $t('Cafes.ourCafesTitle') }}</h2>
    <div class="row">
      <div
        v-for="(ourCafe, index) in ourCafesData"
        class="col-md-6"
        :key="index"
      >
        <div
          class="cafe-image-tile js-scroll-to-map"
          :data-address="ourCafe.dataAddress"
        >
          <div
            class="cafe-image-tile-image-wrapper"
            :style="{
              backgroundImage: ourCafe.imageLink,
              backgroundSize: 'cover',
              backgroundPosition: 'right',
            }"
          ></div>
          <div class="cafe-image-tile-content">
            <h3 class="cafe-image-tile-name">{{ ourCafe.name }}</h3>
            <address class="cafe-tile-address">
              <span :name="ourCafe.name" class="cafe-tile-address-anchor">
                {{ ourCafe.street }}, {{ ourCafe.city }}<br />{{
                  ourCafe.zipCode
                }}, {{ ourCafe.countryWithState }}
              </span>
            </address>
            <p>{{ ourCafe.phone }}</p>
          </div>
        </div>
      </div>
    </div>
    <h2>{{ $t('Cafes.partnerCafesTitle') }}</h2>
    <div class="row">
      <div v-for="(location, index) in locations" :key="index">
        <h3>{{ location }}</h3>
        <template v-for="(partnerCafeModel, index) in partnerCafesData">
          <p :key="index" v-if="partnerCafeModel.location === location">
            {{ partnerCafeModel.name }}, {{ partnerCafeModel.street }},
            {{ partnerCafeModel.phone }}
          </p>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity';
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import type { Cafe } from '@/models';
import { getCafeModel } from '@/Utilities/CafeListing';
import type { CafeModel } from '@/ViewModels/CafeModel';

import { Client } from '../Client.js';
import { defaultLanguage, initLanguageCodeObjectWithArray } from '../Utilities/LanguageCodes'

const { locale } = useI18n();
const ourCafes = ref<Array<Cafe>>([]);
const partnerCafes = ref<Array<Cafe>>([]);

const locations = computed<Array<string>>(() =>
  partnerCafesData.value
    .map((model) => model.location)
    .reduce<Array<string>>((result, location) => {
      if (!result.includes(location)) {
        result.push(location);
      }
      return result;
    }, [])
    .sort()
);

const partnerCafesData = computed<Array<CafeModel>>(() =>
  partnerCafes.value.map((cafe) => getCafeModel(cafe))
);

const ourCafesData = computed<Array<CafeModel>>(() =>
  ourCafes.value.map((cafe) => getCafeModel(cafe))
);



const fetchCafes = (): void => {
  const cafesList = initLanguageCodeObjectWithArray<Cafe>();

  const query = Client.items<Cafe>()
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

    ourCafes.value = locale.value
      ? cafesList[locale.value].filter(
          (cafe) => cafe.elements.country.value === 'USA'
        )
      : cafesList[defaultLanguage].filter(
          (cafe) => cafe.elements.country.value === 'USA'
        );

    partnerCafes.value = locale.value
      ? cafesList[locale.value].filter(
          (cafe) => cafe.elements.country.value !== 'USA'
        )
      : cafesList[defaultLanguage].filter(
          (cafe) => cafe.elements.country.value !== 'USA'
        );
  });
};

onMounted(() => fetchCafes());

watch(locale, () => {
  fetchCafes();
});
</script>
