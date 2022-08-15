<template>
    <div 
        v-html="richTextData" 
        @click="handleClick"
    />
</template>

<script>
import {resolveContentLink} from '../Utilities/ContentLinks'
import { createRichTextHtmlResolver, linkedItemsHelper } from '@kontent-ai/delivery-sdk';

export default {
  name: 'RichTextElement',
  props: ['element'],
  data: () => ({
    richTextData: null
  }),
  mounted: function() {
    this.loadData();
  },
  watch: { 
    element: function() {
      this.loadData();
    }
  },
  methods: {
    handleClick: function(e){
      if (e.target.tagName === 'A' && e.target.hasAttribute('data-item-id')) {
        e.preventDefault();

        const id = e.target.getAttribute('data-item-id');
        const link = this.element.links.find(m => m.itemId === id);

        if (link) {
          const path = resolveContentLink(link);
          const language = this.$i18n.locale;

          if (path) {
            this.$router.push(`/${language}${path}`);
          }
        }
      }
    },
    loadData: function() {
      this.richTextData = createRichTextHtmlResolver().resolveRichText({
        element: this.element,
        linkedItems: linkedItemsHelper.convertLinkedItemsToArray(this.element.linkedItems),
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
            linkHtml: `<a href="${resolveContentLink(link)}">${linkText}</a>`,
          };
        },
      }).html;

    }
  }
}
</script>