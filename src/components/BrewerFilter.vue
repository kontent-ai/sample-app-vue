<template>
    <aside class="col-md-4 col-lg-3 product-filter">
        <h4>{{$t('BrewerFilter.manufacturerTitle')}}</h4>
        <span v-for="manufacturer in manufacturers" class="checkbox js-postback">
            <input
                    v-bind:id="'Manufacturer-' + manufacturer.codename"
                    type="checkbox"
                    v-bind:checked="filter.manufacturers.includes(manufacturer.codename)"
            />
            <label
                    v-bind:htmlFor="'Manufacturer-' + manufacturer.codename"
                    type="checkbox"
                    @click="manufacturerOnChange(manufacturer.codename)">{{manufacturer.name}} </label>
        </span>
        <h4>{{$t('BrewerFilter.priceTitle')}}</h4>
        <span v-for="(priceRange, index) in priceRanges" class="checkbox js-postback">
            <input v-bind:id="'PriceRange-' + index" type="checkbox" :checked="priceRangeIsChecked(priceRange)"/>
            <label v-bind:htmlFor="'PriceRange-' + index" @click="priceRangeOnChange(priceRange)" >{{formatPrice(priceRange.min, language) + " – " + formatPrice(priceRange.max, language)}}</label>
        </span>
        <h4>{{$t('BrewerFilter.statusTitle')}}</h4>
        <span v-for="productStatus in productStatuses" class="checkbox js-postback">
            <input :id="'ProductStatus-' + productStatus.codename" type="checkbox" :checked="filter.productStatuses.includes(productStatus.codename)" />
            <label :htmlFor="'ProductStatus-' + productStatus.codename" @click="productStatusOnChange(productStatus.codename)">{{productStatus.name}}</label>
        </span>
    </aside>
</template>

<script>
    import BrewerStore from '../Stores/Brewer'

    export default{
        name: "BrewerFilter",
        props: ['language'],
        data: () => ({
            filter: null,
            manufacturers: null,
            productStatuses: null,
            priceRanges: [
                { min: 0, max: 50 },
                { min: 50, max: 250 },
                { min: 250, max: 5000 },
            ],
        }),
        created: function(){
            BrewerStore.addChangeListener(this.onChange);
            BrewerStore.provideBrewers();
            BrewerStore.provideManufacturers();
            BrewerStore.provideProductStatuses();
            this.filter = BrewerStore.getFilter();
            this.manufacturers = BrewerStore.getManufacturers();
            this.productStatuses = BrewerStore.getProductStatuses()
        },
        methods: {
            manufacturerOnChange: function(codename){
                this.filter.toggleManufacturer(codename);
                BrewerStore.setFilter(this.filter);
            },
            priceRangeIsChecked: function(priceRange){
                return this.filter.priceRanges
                    .findIndex((x) => x.min === priceRange.min && x.max === priceRange.max) >= 0;
            },
            priceRangeOnChange: function(priceRange){
                this.filter.togglePriceRange(priceRange);
                BrewerStore.setFilter(this.filter);
            },
            formatPrice: function(price, language){
                return price.toLocaleString(language, {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 2
                });
            },
            productStatusOnChange: function(codename){
                this.filter.toggleProductStatus(codename);
                BrewerStore.setFilter(this.filter);
            },
            onChange: function(){
                this.filter = BrewerStore.getFilter();
                this.manufacturers = BrewerStore.getManufacturers();
                this.productStatuses = BrewerStore.getProductStatuses()
            }
        },
        destroyed: function(){
            BrewerStore.removeChangeListener(this.onChange);
        }

    }
</script>