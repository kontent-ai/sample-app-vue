<template>
    <div class="container">
        <div class="col-md-12">
            <h2 class="contact-title">{{t('roasteryTitle')}}</h2>
            <ul v-if="firstCafe" class="contact-info">
                <li>{{firstCafe.phone}}</li>
                <li><a :href="'mailto:' + firstCafe.email" target="_top">{{firstCafe.email}}</a></li>
                <li>
                    <a @click="selectedAddress = firstCafe.dataAdress" :data-address="firstCafe.dataAddress"
                       class="js-scroll-to-map">{{firstCafe.dataAddress}},<br/>
                        {{firstCafe.zipCode}}, {{firstCafe.countryWithState}}<br/>
                    </a>
                </li>
            </ul>
        </div>
        <div>
            <h2>{{t('ourCafesTitle')}}</h2>
            <div class="row">
                <div v-for="(model, index) in cafeModels" class="col-md-6 col-lg-3" :key="index">
                    <div @click="selectedAddress = model.dataAddress" class="cafe-tile cursor-hand js-scroll-to-map"
                         :data-address="model.dataAddress">
                        <div class="cafe-tile-content">
                            <h3 class="cafe-tile-name">{{model.name}}</h3>
                            <address class="cafe-tile-address">
                                <a :name="model.name" class="cafe-tile-address-anchor">
                                    {{model.street}}, {{model.city}}<br/>{{model.zipCode}}, {{model.countryWithState}}
                                </a>
                            </address>
                            <p>{{model.phone}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <h2 class="map-title">{{t('mapTitle')}}</h2>
        <ContactMap :cafesAddresses="cafesAddresses" :focusOnAddress="selectedAddress" />
    </div>
</template>

<script>
    import CafeStore from '../Stores/Cafe'
    import ContactMap from './ContactMap.vue'
    import * as en from '../Localization/en-US.json'
    import * as es from '../Localization/es-ES.json'

    export default {
        name: "Contacts",
        data: () => ({
            cafes: [],
            selectedAddress: null,
        }),
        props: ['language'],
        methods: {
            model: function (cafe) {
                let model = {
                    name: cafe.system.name,
                    street: cafe.street.value,
                    city: cafe.city.value,
                    zipCode: cafe.zipCode.value,
                    country: cafe.country.value,
                    state: cafe.state.value,
                    phone: cafe.phone.value,
                    email: cafe.email.value,
                };
                model.dataAddress = model.city + ", " + model.street;
                model.countryWithState = model.country + (model.state ? ", " + model.state : "");
                return model;
            }
        },
        created: function () {
            CafeStore.getCompanyCafes(this.language).then(cafes => this.cafes = cafes);
            this.$translate.setLocales({
                'en-US': en.Contacts,
                'es-ES': es.Contacts,
            })
        },
        computed: {
            cafeModels: function () {
                return this.cafes.map((cafe) => this.model(cafe));
            },
            firstCafe: function () {
                if(this.cafes.length === 0){
                    return null;
                }
                return this.model(this.cafes[0]);
            },
            cafesAddresses: function(){
                if (this.cafes.length === 0){
                    return [];
                }
                return this.cafes.map((cafe) => {
                    return `${cafe.city.value}, ${cafe.street.value}`;
                })
            }
        },
        components: {
            ContactMap,
        }
    }
</script>