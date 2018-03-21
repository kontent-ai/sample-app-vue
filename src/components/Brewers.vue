<template>
    <div id="product-list" class="col-md-8 col-lg-9 product-list">
        <div v-for="brewer in filteredBrewers" class="col-md-6 col-lg-4" >
            <article class="product-tile">
                <router-link :to="resolveContentLink({ type: 'brewer', url_slug: brewer.urlPattern.value }, language)">
                <h1 class="product-heading">{{brewer.productName.value}}</h1>
                    <span v-if="brewer.productStatus.value.length === 0"/>
                    <span v-else class="product-tile-status">
                        {{brewer.productStatus.value.map(function(x){return x.name}).join(" ,")}}
                    </span>
                <figure class="product-tile-image">
                    <img v-bind:alt="brewer.productName.value" class="" v-bind:src="brewer.image.value[0].url" v-bind:title="brewer.productName.value" />
                </figure>
                <div class="product-tile-info">
                <span class="product-tile-price">
                  {{formatPrice(brewer.price.value, language)}}
                </span>
                </div>
                </router-link>
            </article>
        </div>
    </div>
</template>

<script>
    import BrewerStore from '../Stores/Brewer'
    import {resolveContentLink} from '../Utilities/ContentLinks'
    export default{
        name: "Brewers",
        data: () => ({
            brewers: [],
            filter: null,
        }),
        props: ['language'],
        methods: {
            formatPrice: function(price, language){
                console.log(language);
                return price.toLocaleString(language, {
                    style: "currency",
                    currency: "USD"
                });
            },
            resolveContentLink,
        },
        computed: {
          filteredBrewers: function(){
              if (this.brewers.length === 0 || !this.filter){
                  return [];
              }
              return this.brewers.filter(brewer => this.filter.matches(brewer));
          }
        },
        created: function(){
            BrewerStore.provideBrewers(this.language).then(brewers => this.brewers = brewers);
            this.filter = BrewerStore.getFilter();
        }
    }
</script>