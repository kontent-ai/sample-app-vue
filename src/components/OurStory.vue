<template>
    <div class="row">
        <h1 class="title-tab">{{$t('OurStory.title')}}</h1>
        <div class="col-sm-12">
            <div 
                class="ourstory-section center-text" 
                v-bind:style='sectionStyleObject'
            >
                {{$t('OurStory.text')}}
            </div>
        </div>
    </div>
</template>

<script>
import StoryImage from '../Images/our-story.jpg';

export default {
  name: 'our-story',
  data: () => ({
    sectionStyleObject: {
      backgroundImage: 'url(' + StoryImage + ')',
    },
  }),
}
</script>
