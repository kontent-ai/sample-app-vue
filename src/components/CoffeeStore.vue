<template>
    <div class="product-page row">
        <div class="flex">
            <CoffeeFilter />
            <Coffees />
        </div>
    </div>
</template>

<script>
    import CoffeeFilter from './CoffeeFilter.vue'
    import Coffees from './Coffees.vue'

    export default {
        name: "CoffeeStore",
        components: {
            CoffeeFilter,
            Coffees
        }
    }
</script>

