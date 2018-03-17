<template>
    <div id="product-list" class="col-md-8 col-lg-9 product-list">
        <div v-for="(coffee, index) in filteredCoffees" class="col-md-6 col-lg-4" :key="index">
            <article class="product-tile">
                <router-link :to="`/${language}/coffees/${coffee.urlPattern.value}`">
                <h1 class="product-heading">{{coffee.productName.value}}</h1>
                <span v-if="coffee.productStatus.value.length === 0" />
                <span v-else class="product-tile-status">
                        {{coffee.productStatus.value.map(function(x){return x.name;}).join(", ")}}
                </span>
                <figure class="product-tile-image">
                    <img :alt="coffee.productName.value" class="" :src="coffee.image.value[0].url" :title="coffee.productName.value" />
                </figure>
                <div class="product-tile-info">
                <span class="product-tile-price">
                  {{formatPrice(coffee.price.value, language)}}
                </span>
                </div>
                </router-link>
            </article>
        </div>
    </div>
</template>

<script>
    import CoffeeStore from '../Stores/Coffee'
    export default {
        name: "Coffees",
        data: () => ({
            coffees: [],
            filter: null,
        }),
        props: ['language'],
        computed: {
          filteredCoffees: function(){
              if (this.coffees.length === 0 || !this.filter){
                  return [];
              }
              return this.coffees.filter(coffee => this.filter.matches(coffee));
          }
        },
        methods: {
            formatPrice: function(price, language){
                return price.toLocaleString(language, {
                    style: "currency",
                    currency: "USD"
                })
            }
        },
        created: function(){
            CoffeeStore.getCoffees(this.language).then(coffees => this.coffees = coffees);
            this.filter = CoffeeStore.getFilter();
        }
    }
</script>


