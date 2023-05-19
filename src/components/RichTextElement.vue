<template>
  <div v-html="richTextData" @click="handleClick"></div>
</template>

<script setup lang="ts">
import { type Elements, type ILink, createRichTextHtmlResolver } from '@kontent-ai/delivery-sdk'
import { computed } from '@vue/reactivity';
import { onUpdated } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import type { HostedVideo } from '@/models';

import { resolveContentLink } from '../Utilities/ContentLinks';

const props = defineProps<{
  element: Elements.RichTextElement;
}>();
const router = useRouter();
const i18n = useI18n();

const tweetsToResolve: Record<string, string> = {};

const handleClick = (e: Event) => {
  if (
    (e.target as HTMLElement).tagName === 'A' &&
    (e.target as HTMLElement).hasAttribute('data-item-id')
  ) {
    e.preventDefault();

    const id = (e.target as HTMLElement).getAttribute('data-item-id');
    const link = props.element.links.find((m) => m.linkId === id);

    if (link) {
      const path = resolveContentLink(link);
      const language = i18n.locale;

      if (path) {
        router.push(`/${language}${path}`);
      }
    }
  }
};

const richTextData = computed(() => createRichTextHtmlResolver().resolveRichText({
  element: props.element,
  linkedItems: props.element.linkedItems,
  contentItemResolver: (itemCodename, contentItem) => {
    if (contentItem?.system.type === 'tweet') {
      const tweet = contentItem.elements;
      const tweetLink = tweet.tweetLink.value;
      const tweetID = tweetLink.match('^.*twitter.com/.*/(\\d+)/?.*$')[1];

      tweetsToResolve[tweetID] = tweet.theme.value[0].codename ?? 'light';

      return { contentItemHtml: `<div id="tweet${tweetID}"></div>` };
    }
    if (contentItem?.system.type === 'hosted_video') {
      const video = (contentItem as HostedVideo).elements;
      if (video.videoHost.value.find((item) => item.codename === 'vimeo')) {
        return {
          contentItemHtml: `<iframe class="hosted-video__wrapper"
                                src="https://player.vimeo.com/video/${video.videoId.value}?title=0&byline=0&portrait=0"
                                width="640"
                                height="360"
                                frameborder="0"
                                webkitallowfullscreen
                                mozallowfullscreen
                                allowfullscreen
                                >
                        </iframe>`,
        };
      } else if (
        video.videoHost.value.find((item) => item.codename === 'youtube')
      ) {
        return {
          contentItemHtml: `<iframe class="hosted-video__wrapper"
                                width="560"
                                height="315"
                                src="https://www.youtube-nocookie.com/embed/${video.videoId.value}"
                                frameborder="0"
                                allowfullscreen
                                >
                        </iframe>`,
        };
      }
    }

    return { contentItemHtml: '<div></div>' };
  },
  urlResolver: (linkId, linkText, link) => {
    return {
      linkHtml: `<a href="${resolveContentLink(
        link as ILink,
        i18n.locale.value
      )}">${linkText}</a>`,
    };
  },
}).html);


onUpdated(() => {
  Object.entries(tweetsToResolve).map(([tweetId, selectedTheme]) => {
    window.twttr.widgets.createTweet(
      tweetId,
      document.getElementById(`tweet${tweetId}`),
      {
        theme: selectedTheme,
      }
    )
  })
})

</script>
