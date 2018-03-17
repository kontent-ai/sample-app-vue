<template>
    <div class="row">
        <div>
            <h1 class="title-tab">TASTE OUR COFFEE</h1>
        </div>
        <div v-for="cafe in cafes" class="col-xs-6 col-md-3">
            <div>
                <!--TODO variable for name?-->
                <router-link :to="`${language}/cafes`" class="ourcoffee-tile-link">
                <h2 class="ourcoffee-tile-text center-text">{{cafe.system.name}}</h2>
                <span class="cafe-overlay"> </span>
                <img v-bind:alt="cafe.system.name" class="ourcoffee-tile-image" v-bind:src="cafe.photo.value[0].url" v-bind:title="cafe.system.name" />
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import CafeStore from '../Stores/Cafe'

    export default {
        name: "taste-our-coffee",
        data: () => ({
            cafes: null,
        }),
        props: ['language'],
        created: function(){
            CafeStore.getCompanyCafes(this.language).then(cafes => this.cafes = cafes);
        },
    }
</script>
