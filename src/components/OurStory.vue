<template>
    <div class="row">
        <h1 class="title-tab">{{t('OurStory.title')}}</h1>
        <div class="col-sm-12">
            <div 
                class="ourstory-section center-text" 
                v-bind:style='sectionStyleObject'
            >
                {{t('OurStory.text')}}
            </div>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import StoryImage from '../Images/our-story.jpg';

const { t } = useI18n();

const sectionStyleObject = { backgroundImage: `url(${StoryImage})` }

</script>
