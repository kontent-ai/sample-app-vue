<template>
    <aside class="col-md-4 col-lg-3 product-filter">
        <h4>{{t('coffeeProcessingTitle')}}</h4>
        <div v-for="processing in processings">
            <span class="checkbox js-postback">
            <input :id="processing.codename" type="checkbox" :checked="filter.processings.includes(processing.codename)" >
            <label :htmlFor="processing.codename" @click="processingOnChange(processing.codename)">{{processing.name}}</label>
            </span>
        </div>
        <h4>{{t('statusTitle')}}</h4>
        <div v-for="productStatus in productStatuses">
            <span class="checkbox js-postback">
            <input :id="productStatus.codename" type="checkbox" :checked="filter.productStatuses.includes(productStatus.codename)" />
            <label :htmlFor="productStatus.codename" @click="productStatusOnChange(productStatus.codename)">{{productStatus.name}}</label>
            </span>
        </div>
    </aside>
</template>

<script>
    import CoffeeStore from '../Stores/Coffee'
    import * as en from '../Localization/en-US.json'
    import * as es from '../Localization/es-ES.json'

    export default {
        name: "CoffeeFilter",
        data: () => ({
            filter: null,
            processings: [],
            productStatuses: [],
        }),
        methods: {
            processingOnChange: function(codename){
                this.filter.toggleProcessing(codename);
                CoffeeStore.setFilter(this.filter);
            },
            productStatusOnChange: function(codename){
                this.filter.toggleProductStatus(codename);
                CoffeeStore.setFilter(this.filter);
            }
        },
        created: function(){
            this.filter = CoffeeStore.getFilter();
            this.processings = CoffeeStore.getProcessings().then(processings => this.processings = processings);
            this.productStatuses = CoffeeStore.getProductStatuses().then(productStatuses => this.productStatuses = productStatuses);
        },
        locales: {
            'en-US': en.CoffeeFilter,
            'es-ES': es.CoffeeFilter,
        }
    }
</script>

