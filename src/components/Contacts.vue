<template>
    <div class="container">
        <div class="col-md-12">
            <h2 class="contact-title">{{$t('Contacts.roasteryTitle')}}</h2>
            <ul
                v-if="firstCafe"
                class="contact-info"
            >
                <li>{{firstCafe.phone}}</li>
                <li><a
                    :href="'mailto:' + firstCafe.email"
                    target="_top"
                >{{firstCafe.email}}</a></li>
                <li>
                    <p
                        @click="handleRoasteryClick"
                        :data-address="firstCafe.dataAddress"
                        class="js-scroll-to-map"
                    >{{firstCafe.dataAddress}},<br/>
                        {{firstCafe.zipCode}}, {{firstCafe.countryWithState}}<br/>
                </p>
                </li>
            </ul>
        </div>
        <div>
            <h2>{{$t('Contacts.ourCafesTitle')}}</h2>
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
                            <h3 class="cafe-tile-name">{{model.name}}</h3>
                            <address class="cafe-tile-address">
                                <p
                                    :name="model.name"
                                    class="cafe-tile-address-anchor"
                                >
                                    {{model.street}}, {{model.city}}<br/>{{model.zipCode}}, {{model.countryWithState}}
                            </p>
                            </address>
                            <p>{{model.phone}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Client } from '../Client.js';
import { initLanguageCodeObject, defaultLanguage } from '../Utilities/LanguageCodes';
import VueScrollTo from 'vue-scrollto'
import { useI18n } from 'vue-i18n';
import { computed } from '@vue/reactivity';
import { onMounted, ref } from 'vue';

const { locale } = useI18n();
const language = locale.value;

const cafes = ref([]);
const selectedAddress = ref(null);

const cafeModels = computed(() => cafes.value.map((cafe) => getModel(cafe)));

const firstCafe = computed(() => {
  if(cafes.value.length === 0){
    return null;
  }

  return getModel(cafes.value[0]);
})

const cafesAddresses = computed(() => {
  if (cafes.length === 0){
    return [];
  }

  return cafes.map((cafe) => {
    return `${cafe.elements.city.value}, ${cafe.elements.street.value}`;
  })
})

const getModel = (cafe) => {
  let model = {
    name: cafe.system.name,
    street: cafe.elements.street.value,
    city: cafe.elements.city.value,
    zipCode: cafe.elements.zipCode.value,
    country: cafe.elements.country.value,
    state: cafe.elements.state.value,
    phone: cafe.elements.phone.value,
    email: cafe.elements.email.value,
  };

  model.dataAddress = model.city + ', ' + model.street;
  model.countryWithState = model.country + (model.state ? ', ' + model.state : '');

  return model;
}

const handleRoasteryClick = () => {
  if(selectedAddress === firstCafe.dataAddress){
    VueScrollTo.scrollTo('#map');
    return;
  }

  selectedAddress.value = firstCafe.dataAddress
}

const handleAddressClick = (model) => {
  if(selectedAddress === model.dataAddress){
    VueScrollTo.scrollTo('#map');
    return;
  }
  selectedAddress.value = model.dataAddress
}

const fetchCafes = () => {
  const cafesList = initLanguageCodeObject();

  let query = Client.items()
    .type('cafe')
    .orderParameter('elements.name', 'desc');

  if (language) {
    query.languageParameter(language);
  }

  query.toPromise()
    .then(response => {
      if (language) {
        cafesList[language] = response.data.items;
      } else {
        cafesList[defaultLanguage] = response.data.items;
      }
      cafes.value = language ? 
        cafesList[language].filter((cafe) => cafe.elements.country.value === 'USA') :
        cafesList[defaultLanguage].filter((cafe) => cafe.elements.country.value === 'USA');
    });
}

onMounted(() => fetchCafes());
  // watch: {
  //   language: function(){
  //     fetchCafes();
  //   }
  // },
</script>