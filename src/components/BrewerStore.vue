<template>
    <div class="product-page row">
        <div class="flex">
            <BrewerFilter :language="language" />
            <Brewers :language="language"/>
        </div>
    </div>
</template>

<script>
    import BrewerFilter from './BrewerFilter.vue'
    import Brewers from './Brewers.vue'

    export default {
        name: "BrewerStore",
        props: ['language'],
        components: {
            BrewerFilter,
            Brewers
        },
    }
</script>

