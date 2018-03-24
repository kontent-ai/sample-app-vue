<template>
    <div class="product-page row">
        <div class="flex">
            <CoffeeFilter :language="this.language"/>
            <Coffees :language="this.language"/>
        </div>
    </div>
</template>

<script>
    import CoffeeFilter from './CoffeeFilter.vue'
    import Coffees from './Coffees.vue'

    export default {
        name: "CoffeeStore",
        props: ['language'],
        components: {
            CoffeeFilter,
            Coffees
        },

    }
</script>

