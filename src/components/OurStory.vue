<template>
    <div class="row">
        <h1 class="title-tab">{{this.t('ourStoryTitle')}}</h1>
        <div class="col-sm-12">
            <div class="ourstory-section center-text" v-bind:style='sectionStyleObject'>
            {{this.t('ourStoryText')}}
        </div>
    </div>
    </div>
</template>

<script>
    import StoryImage from '../Images/our-story.jpg';
    import * as en from '../Localization/en-US.json'
    import * as es from '../Localization/es-ES.json'

    export default {
        name: "our-story",
        data: () => ({
            sectionStyleObject: {
                backgroundImage: "url(" + StoryImage + ")",
            },
        }),
        locales: {
            'en-US': en.OurStory,
            'es-ES': es.OurStory
        }
    }
</script>
