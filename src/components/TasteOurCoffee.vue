<template>
    <div class="row">
        <div>
            <h1 class="title-tab">TASTE OUR COFFEE</h1>
        </div>
        <!--{cafes}-->
        Cafes
    </div>
</template>

<script>
    import CafeStore from '../Stores/Cafe'

    export default {
        name: "taste-our-coffee",
        data: () => ({
            cafes: CafeStore.getCompanyCafes('en-US'),
        })
    }
</script>
