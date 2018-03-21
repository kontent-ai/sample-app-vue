<template>
    <div class="container">
        <h2>{{t('ourCafesTitle')}}</h2>
        <div class="row">
            <div v-for="(ourCafe,index) in ourCafes" class="col-md-6" :key="index">
                <div class="cafe-image-tile js-scroll-to-map" :data-address="model(ourCafe).dataAddress">
                    <div class="cafe-image-tile-image-wrapper" :style="{ backgroundImage: model(ourCafe).imageLink, backgroundSize: 'cover', backgroundPosition: 'right' }">
                </div>
                <div class="cafe-image-tile-content">
                    <h3 class="cafe-image-tile-name">{{model(ourCafe).name}}</h3>
                    <address class="cafe-tile-address">
                <span :name="model(ourCafe).name" class="cafe-tile-address-anchor">
                  {{model(ourCafe).street}}, {{model(ourCafe).city}}<br />{{model(ourCafe).zipCode}}, {{model(ourCafe).countryWithState}}
                </span>
                    </address>
                    <p>{{model(ourCafe).phone}}</p>
                </div>
            </div>
        </div>
        </div>
        <h2>{{t('partnerCafesTitle')}}</h2>
        <div class="row">
            <div v-for="(location, locationIndex) in locations" :key="locationIndex">
                <h3>{{location}}</h3>
                <p
                        v-for="(partnerCafeModel, index) in partnerCafes.map(function(cafe){return model(cafe);})"
                        v-if="partnerCafeModel.location === location"
                        :key="index">
                    {{partnerCafeModel.name}}, {{partnerCafeModel.street}}, {{partnerCafeModel.phone}}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    import CafeStore from '../Stores/Cafe';
    import * as en from '../Localization/en-US.json'
    import * as es from '../Localization/es-ES.json'

    export default {
        name: "Cafes",
        props: ['language'],
        data: () => ({
            ourCafes: [],
            partnerCafes: [],
        }),
        computed: {
          locations: function(){
              let models = this.partnerCafes.map(cafe => this.model(cafe));
              return  models.map((model) => model.location).reduce((result, location) => {
                  if (result.indexOf(location) < 0) {
                      result.push(location);
                  }

                  return result;
              }, []).sort();
          }
        },
        methods: {
            //TODO make model computed?
            model: function(cafe){
                let model = {
                    name: cafe.system.name,
                    imageLink: "url(" + cafe.photo.value[0].url + ")",
                    street: cafe.street.value,
                    city: cafe.city.value,
                    zipCode: cafe.zipCode.value,
                    country: cafe.country.value,
                    state: cafe.state.value,
                    phone: cafe.phone.value,

                }
                model.dataAddress = model.city + ", " + model.street;
                model.countryWithState = model.country + (model.state ? ", " + model.state : "");
                model.location = model.city + ", " + model.countryWithState;
                return model;
            },
            getCompanyCafesData: function(){
                CafeStore.getCompanyCafes(this.language).then(companyCafes => this.ourCafes = companyCafes);
            },
            getPartnerCafesData: function(){
                CafeStore.getPartnerCafes(this.language).then(partnerCafes => this.partnerCafes = partnerCafes);
            }
        },
        created: function(){
            this.getCompanyCafesData();
            this.getPartnerCafesData();
            this.$translate.setLocales({
                'en-US': en.Cafes,
                'es-ES': es.Cafes,
            })
        },

    }
</script>