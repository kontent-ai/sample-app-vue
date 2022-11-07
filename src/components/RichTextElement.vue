<template>
    <div 
        v-html="richTextData" 
        @click="handleClick"
    ></div>
</template>

<script setup>
import {resolveContentLink} from '../Utilities/ContentLinks'
import { createRichTextHtmlResolver, linkedItemsHelper } from '@kontent-ai/delivery-sdk';
import { onMounted, onUpdated, ref, watch } from 'vue';
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n';

const props = defineProps(['element']);
const richTextData = ref(null);
const router = useRouter();
const i18n = useI18n()

const handleClick = (e) => {
  if (e.target.tagName === 'A' && e.target.hasAttribute('data-item-id')) {
    e.preventDefault();

    const id = e.target.getAttribute('data-item-id');
    const link = props.element.links.find(m => m.itemId === id);

    if (link) {
      const path = resolveContentLink(link);
      const language = i18n.locale;

      if (path) {
        router.push(`/${language}${path}`);
      }
    }
  }
}

const loadData = () => {
      richTextData.value = createRichTextHtmlResolver().resolveRichText({
        element: props.element,
        linkedItems: linkedItemsHelper.convertLinkedItemsToArray(props.element.linkedItems),
        contentItemResolver: (itemCodename, contentItem) => {
          if(contentItem.system.type === 'tweet'){
            const tweet = contentItem.elements;
            let tweetLink = tweet.tweetLink.value;
            let tweetID = tweetLink.match('^.*twitter.com/.*/(\\d+)/?.*$')[1];

            let selectedTheme = tweet.theme.value[0].codename;
            selectedTheme = selectedTheme ? selectedTheme : 'light';

            setTimeout(() => {
              window.twttr.widgets.createTweet(
                tweetID,
                document.getElementById(`tweet${tweetID}`),
                {
                  theme: selectedTheme,
                }
              );
            }, 150);

            return { contentItemHtml: `<div id="tweet${tweetID}"></div>` };
          }
          if (contentItem.system.type === 'hosted_video') {
            const video = contentItem.elements;
            if (video.videoHost.value.find(item => item.codename === 'vimeo')) {
              return `<iframe class="hosted-video__wrapper"
                                src="https://player.vimeo.com/video/${video.videoId.value}?title =0&byline =0&portrait =0"
                                width="640"
                                height="360"
                                frameborder="0"
                                webkitallowfullscreen
                                mozallowfullscreen
                                allowfullscreen
                                >
                        </iframe>`;
            }
            else if (video.videoHost.value.find(item => item.codename === 'youtube')) {
              return { contentItemHtml: `<iframe class="hosted-video__wrapper"
                                width="560"
                                height="315"
                                src="https://www.youtube.com/embed/${video.videoId.value}"
                                frameborder="0"
                                allowfullscreen
                                >
                        </iframe>` };
            }
          }

          return '<div></div>';
        },
        urlResolver: (linkId, linkText, link) => {
          return {
            linkHtml: `<a href="${resolveContentLink(link, i18n.locale.value)}">${linkText}</a>`,
          };
        },
      }).html;
    }

  onMounted(() => {
    loadData();
  });

  onUpdated(() => {
    loadData();
  });

</script>