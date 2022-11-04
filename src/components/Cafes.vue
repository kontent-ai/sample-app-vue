<template>
    <div class="container">
        <h2>{{$t('Cafes.ourCafesTitle')}}</h2>
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
                        :style="{ backgroundImage: ourCafe.imageLink, backgroundSize: 'cover', backgroundPosition: 'right' }"
                    >
                    </div>
                    <div class="cafe-image-tile-content">
                        <h3 class="cafe-image-tile-name">{{ourCafe.name}}</h3>
                        <address class="cafe-tile-address">
                            <span
                                :name="ourCafe.name"
                                class="cafe-tile-address-anchor"
                            >
                                {{ourCafe.street}}, {{ourCafe.city}}<br/>{{ourCafe.zipCode}}, {{ourCafe.countryWithState}}
                            </span>
                        </address>
                        <p>{{ourCafe.phone}}</p>
                    </div>
                </div>
            </div>
        </div>
        <h2>{{$t('Cafes.partnerCafesTitle')}}</h2>
        <div class="row">
            <div
                v-for="(location, index) in locations"
                :key="index"
            >
                <h3>{{location}}</h3>
                <template
                  v-for="(partnerCafeModel, index) in partnerCafesData" >
                <p
                    :key="index"
                    v-if="partnerCafeModel.location === location"
                >
                    {{partnerCafeModel.name}}, {{partnerCafeModel.street}}, {{partnerCafeModel.phone}}
                </p>
              </template>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Client } from '../Client.js';
import { computed } from '@vue/reactivity';
import { initLanguageCodeObject, defaultLanguage } from '../Utilities/LanguageCodes';

const  { locale } = useI18n();
const language = locale.value;

const ourCafes = ref([]);
const partnerCafes = ref([]);

const locations = computed(() => partnerCafesData
  .value
  .map(model => model.location)
  .reduce((result, location) => {
    if (result.indexOf(location) < 0) {
      result.push(location);
    }
    return result;
  }, [])
  .sort())

const partnerCafesData = computed(() => partnerCafes.value.map(cafe => getModel(cafe)))

const ourCafesData = computed(() => ourCafes.value.map(cafe => getModel(cafe)));

const getModel = (cafe) => {
  let model = {
    name: cafe.system.name,
    imageLink: 'url(' + cafe.elements.photo.value[0].url + ')',
    street: cafe.elements.street.value,
    city: cafe.elements.city.value,
    zipCode: cafe.elements.zipCode.value,
    country: cafe.elements.country.value,
    state: cafe.elements.state.value,
    phone: cafe.elements.phone.value
  };

  model.dataAddress = model.city + ', ' + model.street;
  model.countryWithState =
    model.country + (model.state ? ', ' + model.state : '');
  model.location = model.city + ', ' + model.countryWithState;

  return model;
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
      console.log(language)
      if (language) {
        cafesList[language] = response.data.items;
      } else {
        cafesList[defaultLanguage] = response.data.items;
      }

      ourCafes.value = language ? 
        cafesList[language].filter((cafe) => cafe.elements.country.value === 'USA') :
        cafesList[defaultLanguage].filter((cafe) => cafe.elements.country.value === 'USA');

      partnerCafes.value = language ? 
        cafesList[language].filter((cafe) => cafe.elements.country.value !== 'USA') :
        cafesList[defaultLanguage].filter((cafe) => cafe.elements.country.value !== 'USA');
    });
}

onMounted(() => fetchCafes());
  // watch: {
  //   language: function() {
  //     this.fetchCafes()
  //   }
</script>