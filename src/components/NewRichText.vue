<script lang="ts">
import {
  RichTextBrowserParser,
  isLinkedItem,
  type IDomNode,
RichTextNodeParser,
} from '@pokornyd/kontent-ai-rich-text-parser';
import { type VNode, h, type Component } from 'vue';
import { type IContentItem } from '@kontent-ai/delivery-sdk';
import type { HostedVideo } from '@/models';
import Video from './Video.vue';
import { parse } from 'qs';

export default {
  name: 'NewRichText',
  props: {
    value: {
      type: String,
      required: true,
    },
    // TODO Linked items
    linkedItems: {
      type: Array<IContentItem>,
      default: [],
    },
  },
  computed: {
    resolvedValue() {

      const parsedTree = new RichTextNodeParser().parse(this.value);

      // TODO
      const link = (domNode: IDomNode): string | VNode => {
        if (domNode.type === 'tag') {
          // TODO Recursion vs. cycle
          const childElements = domNode.children.map((node) => link(node));

          // Resolution
          if (isLinkedItem(domNode)) {
            const itemCode = domNode.attributes['data-codename'];
            // TODO Provide a way to get the item by default
            const linkedItem = this.linkedItems.find(
              (item) => item.system.codename === itemCode
            );

            switch (linkedItem?.system.type) {
              case 'tweet': {
                // TODO test out external call
                const tweet = linkedItem?.elements;
                let tweetLink = tweet?.tweetLink.value;
                let tweetID = tweetLink.match(
                  '^.*twitter.com/.*/(\\d+)/?.*$'
                )[1];

                let selectedTheme = tweet?.theme.value[0].codename;
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

                // TODO Think wha this is rendered as simple string -> wee need to feed it somehow
                return h('div', { id: `tweet${tweetID}` }); // `<div id="tweet${tweetID}"></div>`;
              }
              case 'hosted_video': {
                const video = (linkedItem as HostedVideo).elements;
                if (
                  video.videoHost.value.find(
                    (item) => item.codename === 'vimeo'
                  )
                ) {
                  return h(Video, {
                    src: `https://player.vimeo.com/video/${video.videoId.value}?title=0&byline=0&portrait=0`,
                    width: 640,
                    height: 360,
                    frameBorder: 0,
                  });
                } else if (
                  video.videoHost.value.find(
                    (item) => item.codename === 'youtube'
                  )
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
                return `<div style="backgroundColor: red">ERROR</div>`;
            }
          }

          // TODO For non-pair element like <br/> to avoid error? as in React
          // TODO For non-pair element like <br/> to avoid error? as in React

          // TODO -> is that correct approach
          const element = h(domNode.tagName, domNode.attributes, childElements);
          return element;
        } else if (domNode.type === 'text') {
          return domNode.content;
        }

        throw new Error('Undefined state');
      };

      return parsedTree.children.map(link);
    },
  },
  render() {
    return this.resolvedValue;
  },
};
</script>
