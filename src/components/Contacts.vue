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
                    <a
                        @click="handleRoasteryClick"
                        :data-address="firstCafe.dataAddress"
                        class="js-scroll-to-map"
                    >{{firstCafe.dataAddress}},<br/>
                        {{firstCafe.zipCode}}, {{firstCafe.countryWithState}}<br/>
                    </a>
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
                                <a
                                    :name="model.name"
                                    class="cafe-tile-address-anchor"
                                >
                                    {{model.street}}, {{model.city}}<br/>{{model.zipCode}}, {{model.countryWithState}}
                                </a>
                            </address>
                            <p>{{model.phone}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <h2 class="map-title">{{$t('Contacts.mapTitle')}}</h2>
        <ContactMap
            :cafesAddresses="cafesAddresses"
            :focusOnAddress="selectedAddress"
        />
    </div>
</template>

<script>
import { Client } from '../Client.js';
import { initLanguageCodeObject, defaultLanguage } from '../Utilities/LanguageCodes';
import ContactMap from './ContactMap.vue'
import VueScrollTo from 'vue-scrollto'

let languageInitialized = {};

export default {
  name: 'Contacts',
  props: ['language'],
  data: () => ({
    cafes: [],
    selectedAddress: null,
  }),
  computed: {
    cafeModels: function () {
      return this.cafes.map((cafe) => this.getModel(cafe));
    },
    firstCafe: function () {
      if(this.cafes.length === 0){
        return null;
      }
      return this.getModel(this.cafes[0]);
    },
    cafesAddresses: function(){
      if (this.cafes.length === 0){
        return [];
      }
      return this.cafes.map((cafe) => {
        return `${cafe.elements.city.value}, ${cafe.elements.street.value}`;
      })
    }
  },
  watch: {
    language: function(){
      this.fetchCafes();
    }
  },
  methods: {
    getModel: function (cafe) {
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
    },
    handleRoasteryClick: function(){
      if(this.selectedAddress === this.firstCafe.dataAddress){
        VueScrollTo.scrollTo('#map');
        return;
      }
      this.selectedAddress = this.firstCafe.dataAddress
    },
    handleAddressClick: function(model){
      if(this.selectedAddress === model.dataAddress){
        VueScrollTo.scrollTo('#map');
        return;
      }
      this.selectedAddress = model.dataAddress
    },
    fetchCafes() {
      const cafesList = initLanguageCodeObject();
      if (languageInitialized[this.language]) {
        return;
      }

      let query = Client.items()
        .type('cafe')
        .orderParameter('elements.name', 'desc');

      if (this.language) {
        query.languageParameter(this.language);
      }

      query.toPromise()
        .then(response => {
          if (this.language) {
            cafesList[this.language] = response.data.items;
          } else {
            cafesList[defaultLanguage] = response.data.items;
          }
          languageInitialized[this.language] = true;
          this.cafes = this.language ? 
            cafesList[this.language].filter((cafe) => cafe.elements.country.value === 'USA') :
            cafesList[defaultLanguage].filter((cafe) => cafe.elements.country.value === 'USA');
        });
    }
  },
  mounted: function() {
    this.fetchCafes();
  },
  components: {
    ContactMap,
  },
}
</script>