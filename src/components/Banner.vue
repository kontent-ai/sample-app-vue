<template>
    <section class="banner-section" v-bind:style="sectionStyleObject" >
    <h2 class="banner-heading">{{heading}}</h2>
    <p class="banner-text">
        {{text}}
    </p>
    </section>
</template>

<script>
    import BackgroundImage from '../Images/banner-default.jpg';

    export default {
        name: "Banner",
        data: () => ({
            sectionStyleObject: {
                backgroundImage: "url(" + BackgroundImage + ")",
            },
            heading: 'Roasting premium coffee',
            text: "Discover the fascinating world of Dancing Goat high-quality coffee and you will never miss a single coffee break again.",
        })
    }
</script>

