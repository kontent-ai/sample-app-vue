<template>
    <div class="container">
        <h2>{{$t('Cafes.ourCafesTitle')}}</h2>
        <div class="row">
            <div v-for="(ourCafe, index) in ourCafesData" class="col-md-6" :key="index">
                <div class="cafe-image-tile js-scroll-to-map" :data-address="ourCafe.dataAddress">
                    <div class="cafe-image-tile-image-wrapper"
                         :style="{ backgroundImage: ourCafe.imageLink, backgroundSize: 'cover', backgroundPosition: 'right' }">
                    </div>
                    <div class="cafe-image-tile-content">
                        <h3 class="cafe-image-tile-name">{{ourCafe.name}}</h3>
                        <address class="cafe-tile-address">
                <span :name="ourCafe.name" class="cafe-tile-address-anchor">
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
            <div v-for="(location, index) in locations" :key="index">
                <h3>{{location}}</h3>
                <p
                        v-for="(partnerCafeModel, index) in partnerCafesData" :key="index"
                        v-if="partnerCafeModel.location === location"
                >
                    {{partnerCafeModel.name}}, {{partnerCafeModel.street}}, {{partnerCafeModel.phone}}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import CafeStore from "../Stores/Cafe";

export default {
  name: "Cafes",
  props: ["language"],
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
      CafeStore.provideCompanyCafes(this.language);
      CafeStore.providePartnerCafes(this.language);
    }
  },
  methods: {
    getModel: function(cafe) {
      let model = {
        name: cafe.system.name,
        imageLink: "url(" + cafe.photo.value[0].url + ")",
        street: cafe.street.value,
        city: cafe.city.value,
        zipCode: cafe.zipCode.value,
        country: cafe.country.value,
        state: cafe.state.value,
        phone: cafe.phone.value
      };
      model.dataAddress = model.city + ", " + model.street;
      model.countryWithState =
        model.country + (model.state ? ", " + model.state : "");
      model.location = model.city + ", " + model.countryWithState;
      return model;
    },
    onChange: function() {
      this.ourCafes = CafeStore.getCompanyCafes(this.language);
      this.partnerCafes = CafeStore.getPartnerCafes(this.language);
    }
  },
  created: function() {
    CafeStore.addChangeListener(this.onChange);
    CafeStore.provideCompanyCafes(this.language);
    CafeStore.providePartnerCafes(this.language);
    this.ourCafes = CafeStore.getCompanyCafes(this.language);
    this.partnerCafes = CafeStore.getPartnerCafes(this.language);
  },
  destroyed: function() {
    CafeStore.removeChangeListener(this.onChange);
  }
};
</script>