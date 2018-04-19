<template>
    <div class="row">
        <div>
            <h1 class="title-tab">{{$t('TasteOurCoffee.title')}}</h1>
        </div>
        <div v-for="(cafe, index) in cafesData" class="col-xs-6 col-md-3" :key="index">
            <div>
                <router-link :to="cafesLink" class="ourcoffee-tile-link">
                <h2 class="ourcoffee-tile-text center-text">{{cafe.name}}</h2>
                <span class="cafe-overlay"> </span>
                <img v-bind:alt="cafe.name" class="ourcoffee-tile-image" v-bind:src="cafe.imageLink" v-bind:title="cafe.name" />
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import CafeStore from '../Stores/Cafe'

    export default {
        name: "taste-our-coffee",
        props: ['language'],
        data: () => ({
            cafes: [],
            cafesLink: `${this.language}/cafes`,
        }),
        computed: {
            cafesData: function(){
                return this.cafes.map(cafe => ({
                    name: cafe.system.name,
                    imageLink: cafe.photo.value[0].url,
                }))
            },
        },
        watch: {
            language: function(){
                CafeStore.provideCompanyCafes(this.language);
            }
        },
        methods: {
            onChange: function(){
                this.cafes = CafeStore.getCompanyCafes(this.language);
            }
        },
        created: function(){
            CafeStore.addChangeListener(this.onChange);
            CafeStore.provideCompanyCafes(this.language);
            this.cafes = CafeStore.getCompanyCafes(this.language);
        },
        destroyed: function(){
            CafeStore.removeChangeListener(this.onChange);
        }
    }
</script>
