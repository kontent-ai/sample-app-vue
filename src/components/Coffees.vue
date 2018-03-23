<template>
    <div id="product-list" class="col-md-8 col-lg-9 product-list">
        <div v-for="coffee in coffeesData" class="col-md-6 col-lg-4">
            <article class="product-tile">
                <router-link :to="coffee.link">
                    <h1 class="product-heading">{{coffee.name}}</h1>
                    <span v-if="coffee.hasNoProductStatus"/>
                    <span v-else class="product-tile-status">
                        {{coffee.productStatusText}}
                </span>
                    <figure class="product-tile-image">
                        <img :alt="coffee.name" class="" :src="coffee.imageLink"
                             :title="coffee.name"/>
                    </figure>
                    <div class="product-tile-info">
                <span class="product-tile-price">
                  {{coffee.price}}
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
            filteredCoffees: function () {
                if (this.coffees.length === 0 || !this.filter) {
                    return [];
                }
                return this.coffees.filter(coffee => this.filter.matches(coffee));
            },
            coffeesData: function () {
                return this.filteredCoffees.map(coffee => ({
                    price: this.formatPrice(coffee.price.value, this.language),
                    name: coffee.productName.value,
                    imageLink: coffee.image.value[0].url,
                    link: `/${this.language}/coffees/${coffee.urlPattern.value}`,
                    hasNoProductStatus: coffee.productStatus.value.length === 0,
                    productStatusText: coffee.productStatus.value.map(x => x.name).join(", ")
                }))
            }
        },
        watch: {
            language: function () {
                CoffeeStore.provideCoffees(this.language);
            }
        },
        methods: {
            formatPrice: function (price, language) {
                return price.toLocaleString(language, {
                    style: "currency",
                    currency: "USD"
                })
            },
            onChange: function () {
                this.filter = CoffeeStore.getFilter();
                this.coffees = CoffeeStore.getCoffees(this.language);
            }
        },
        created: function () {
            CoffeeStore.addChangeListener(this.onChange);
            CoffeeStore.provideCoffees(this.language);
            this.filter = CoffeeStore.getFilter();
            this.coffees = CoffeeStore.getCoffees(this.language);

        },
        destroyed: function () {
            CoffeeStore.removeChangeListener(this.onChange);
        }
    }
</script>


