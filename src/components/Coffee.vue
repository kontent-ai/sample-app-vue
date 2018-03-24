<template>
    <div class="container" v-if="!coffee">
    </div>
    <div class="container" v-else>
        <article v-if="coffee" class="product-detail">
            <div class="row">
                <div class="col-md-12">
                    <header>
                        <h2>{{name}}</h2>
                    </header>
                </div>
            </div>
            <div class="row-fluid">
                <div class="col-lg-7 col-md-6">
                    <figure class="image">
                        <img :alt="name" class="" :src="imageLink" :title="name"/>
                    </figure>
                    <div class="description">
                        <RichTextElement v-if="descriptionElement" :element="descriptionElement"/>
                        <div class="product-detail-properties">
                            <h4>Parameters</h4>
                            <dl class="row">
                                <dt class="col-xs-12 col-sm-4">Farm</dt>
                                <dd class="col-xs-12 col-sm-8">{{farm}}</dd>
                                <dt class="col-xs-12 col-sm-4">Variety</dt>
                                <dd class="col-xs-12 col-sm-8">{{variety}}</dd>
                                <dt class="col-xs-12 col-sm-4">Processing</dt>
                                <dd class="col-xs-12 col-sm-8">{{processing}}</dd>
                                <dt class="col-xs-12 col-sm-4">Altitude</dt>
                                <dd class="col-xs-12 col-sm-8">{{altitude}}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    </div>
</template>

<script>
    import CoffeeStore from '../Stores/Coffee'
    import RichTextElement from './RichTextElement.vue'

    export default {
        name: "Coffee",
        props: ['language'],
        data: () => ({
            coffee: null,
        }),
        computed: {
            name: function () {
                return this.coffee ? this.coffee.productName.value : ""
            },
            imageLink: function () {
                return this.coffee ? this.coffee.image.value[0].url : ""
            },
            descriptionElement: function () {
                return this.coffee ? this.coffee.longDescription : null
            },
            farm: function () {
                return this.coffee ? this.coffee.farm.value : ""
            },
            variety: function () {
                return this.coffee ? this.coffee.variety.value : ""
            },
            processing: function () {
                return this.coffee && this.coffee.processing.value.length > 0 ? this.coffee.processing.value[0].name : ""
            },
            altitude: function () {
                return this.coffee ? this.coffee.altitude.value + " feet" : ""
            },
        },
        watch: {
            language: function () {
                CoffeeStore.provideCoffee(this.$route.params.coffeeSlug, this.language);
            }
        },
        methods: {
            onChange: function () {
                this.coffee = CoffeeStore.getCoffee(this.$route.params.coffeeSlug, this.language);
            }
        },
        created: function () {
            CoffeeStore.addChangeListener(this.onChange);
            CoffeeStore.provideCoffee(this.$route.params.coffeeSlug, this.language);
            this.coffee = CoffeeStore.getCoffee(this.$route.params.coffeeSlug, this.language);
        },
        destroyed: function () {
            CoffeeStore.removeChangeListener(this.onChange);
        },
        components: {
            RichTextElement,
        },
    }
</script>