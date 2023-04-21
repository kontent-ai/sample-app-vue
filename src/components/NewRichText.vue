<template>
  <SanityBlocks :blocks="blocks" :serializers="serializers" />
</template>

<script setup lang="ts">

import type { HostedVideo } from '@/models';
import type { IContentItem } from '@kontent-ai/delivery-sdk';
import { browserParse, transformToPortableText } from '@kontent-ai/rich-text-resolver';
import type {IPortableTextComponent} from '@kontent-ai/rich-text-resolver';
import { SanityBlocks } from 'sanity-blocks-vue-component';
import { defineProps, h } from 'vue';
import Video from './Video.vue';


const props = defineProps<{
value: string;
linkedItems?: Array<IContentItem>;
}>();

const parsedTree = browserParse(props.value);
const blocks = transformToPortableText(parsedTree);
// TODO fix any
const serializers: any= {
  types: {
    // TODO add link resolution
    component: (block: IPortableTextComponent) => {
      const linkedItem = props.linkedItems?.find(
          (item) => item.system.codename === block.component._ref
        );

        switch (linkedItem?.system.type) {
          case 'tweet': {
            // TODO test out external call
            const tweet = linkedItem?.elements;
            let tweetLink = tweet?.tweetLink.value;
            let tweetID = tweetLink.match('^.*twitter.com/.*/(\\d+)/?.*$')[1];

            let selectedTheme = tweet?.theme.value[0].codename;
            selectedTheme = selectedTheme ? selectedTheme : 'light';

            // TODO finish non working tweet
            setTimeout(() => {
              window.twttr.widgets.createTweet(
                tweetID,
                document.getElementById(`tweet${tweetID}`),
                {
                  theme: selectedTheme,
                }
              );
            }, 150);

            // `<div id="tweet${tweetID}"></div>`;
            return h('div', { id: `tweet${tweetID}` },["Loading tweet..."]); 
          }
          case 'hosted_video': {
            const video = (linkedItem as HostedVideo).elements;
            if (
              video.videoHost.value.find((item) => item.codename === 'vimeo')
            ) {
              return h(Video, {
                src: `https://player.vimeo.com/video/${video.videoId.value}?title=0&byline=0&portrait=0`,
                width: 640,
                height: 360,
                frameBorder: 0,
              });
            } else if (
              video.videoHost.value.find((item) => item.codename === 'youtube')
            ) {
              return h(Video, {
                src: `https://www.youtube.com/embed/${video.videoId.value}`,
                width: 640,
                height: 315,
                frameBorder: 0,
              });
            } else {
              return h(
                'div',
                {
                  style: 'backgroundColor: red',
                },
                'ERROR'
              );
            }
          }
          default:
            return h('div', {style: "backgroundColor: red"},["ERROR"]);
        }
    }
  }
};
</script>