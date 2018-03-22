<template>
    <aside class="col-md-4 col-lg-3 product-filter">
        <h4>{{$t('CoffeeFilter.coffeeProcessingTitle')}}</h4>
        <div v-for="processing in processings">
            <span class="checkbox js-postback">
            <input :id="processing.codename" type="checkbox" :checked="filter.processings.includes(processing.codename)" >
            <label :htmlFor="processing.codename" @click="processingOnChange(processing.codename)">{{processing.name}}</label>
            </span>
        </div>
        <h4>{{$t('CoffeeFilter.statusTitle')}}</h4>
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
            },
            onChange: function(){
                this.processings = CoffeeStore.getProcessings();
                this.productStatuses = CoffeeStore.getProductStatuses();
                this.filter = CoffeeStore.getFilter();
            }
        },
        watch:{
            language: function(){
                CoffeeStore.provideProcessings();
                CoffeeStore.provideProductStatuses();
            }
        },
        created: function(){
            CoffeeStore.addChangeListener(this.onChange);
            CoffeeStore.provideProcessings();
            CoffeeStore.provideProductStatuses();
            this.processings = CoffeeStore.getProcessings();
            this.productStatuses = CoffeeStore.getProductStatuses();
            this.filter = CoffeeStore.getFilter();
        },
        destroyed: function(){
            CoffeeStore.removeChangeListener(this.onChange);
        }
    }
</script>

