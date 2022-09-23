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
                <p
                    v-for="(partnerCafeModel, index) in partnerCafesData.filter(cafe => cafe.location == location)"
                    :key="index"
                >
                    {{partnerCafeModel.name}}, {{partnerCafeModel.street}}, {{partnerCafeModel.phone}}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { Client } from '../Client.js';
import { initLanguageCodeObject, defaultLanguage } from '../Utilities/LanguageCodes';

export default {
  name: 'Cafes',
  props: ['language'],
  data: () => ({
    ourCafes: [],
    partnerCafes: []
  }),
  computed: {
    locations: function() {
      return this.partnerCafesData
        .map(model => model.location)
        .reduce((result, location) => {
          if (result.indexOf(location) < 0) {
            result.push(location);
          }
          return result;
        }, [])
        .sort();
    },
    partnerCafesData: function() {
      return this.partnerCafes.map(cafe => this.getModel(cafe));
    },
    ourCafesData: function() {
      return this.ourCafes.map(cafe => this.getModel(cafe));
    }
  },
  watch: {
    language: function() {
      this.fetchCafes()
    }
  },
  methods: {
    getModel: function(cafe) {
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
    },
    fetchCafes() {
      const cafesList = initLanguageCodeObject();

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
          this.ourCafes = this.language ? 
            cafesList[this.language].filter((cafe) => cafe.elements.country.value === 'USA') :
            cafesList[defaultLanguage].filter((cafe) => cafe.elements.country.value === 'USA');
          this.partnerCafes = this.language ? 
            cafesList[this.language].filter((cafe) => cafe.elements.country.value !== 'USA') :
            cafesList[defaultLanguage].filter((cafe) => cafe.elements.country.value !== 'USA');
        });
    }
  },
  mounted: function() {
    this.fetchCafes();
  },
};
</script>