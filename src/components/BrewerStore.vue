<template>
    <div class="product-page row">
        <div class="flex">
            <BrewerFilter/>
            <Brewers/>
        </div>
    </div>
</template>

<script>
    import BrewerFilter from './BrewerFilter.vue'
    import Brewers from './Brewers.vue'

    export default {
        name: "BrewerStore",
        components: {
            BrewerFilter,
            Brewers
        }
    }
</script>

