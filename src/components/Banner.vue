<template>
    <section class="banner-section" v-bind:style="sectionStyleObject">
        <h2 class="banner-heading">{{$t('Banner.heading')}}</h2>
        <p class="banner-text">
            {{$t('Banner.text')}}
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
        }),
    }
</script>
