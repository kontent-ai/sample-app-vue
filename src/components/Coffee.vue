<template>
    <div class="container" v-if="!coffee">
    </div>
    <div class="container" v-else>
        <article  v-if="coffee" class="product-detail">
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
                        <img :alt="name" class="" :src="imageLink" :title="name" />
                    </figure>
                    <div class="description">
                        <!--TODO should not render if descEle is null, remove v-if-->
                        <RichTextElement v-if="descriptionElement" :element="descriptionElement" />
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
        data: () => ({
            coffee: null,
            name: "",
            imageLink: "",
            descriptionElement: null,
            farm: "",
            variety: "",
            processing: "",
            altitude: "",
        }),
        props: ['language'],
        methods: {
            onChange: function(){
                this.coffee = CoffeeStore.getCoffee(this.$route.params.coffeeSlug, this.language);
            }
        },
        watch: {
            coffee: function(newCoffee){
                if(!newCoffee){
                    return;
                }
                this.name = newCoffee.productName.value;
                this.imageLink = newCoffee.image.value[0].url;
                this.descriptionElement = newCoffee.longDescription;
                this.farm = newCoffee.farm.value;
                this.variety = newCoffee.variety.value ;
                this.processing = newCoffee.processing.value.length > 0 ? newCoffee.processing.value[0].name : "";
                this.altitude =  newCoffee.altitude.value + " feet";
            },
            language: function(){
                CoffeeStore.provideCoffee(this.$route.params.coffeeSlug, this.language);
            }
        },
        created: function(){
            CoffeeStore.addChangeListener(this.onChange);
            CoffeeStore.provideCoffee(this.$route.params.coffeeSlug, this.language);
            this.coffee = CoffeeStore.getCoffee(this.$route.params.coffeeSlug, this.language);
        },
        components: {
            RichTextElement,
        },
        destroyed: function(){
            CoffeeStore.removeChangeListener(this.onChange);
        }
    }
</script>