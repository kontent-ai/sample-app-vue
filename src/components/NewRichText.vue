import type { AboutUs from '@/models';
<script lang="ts">
import { RichTextResolver } from 'kontent-rich-text-to-json-converter';
import {
  isLinkedItem,
  type IDomNode,
} from 'kontent-rich-text-to-json-converter/src';
import { type VNode, h } from 'vue';
import { type IContentItem } from '@kontent-ai/delivery-sdk';
import type { HostedVideo } from '@/models';

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
      const parsedTree = new RichTextResolver().parse({
        value: this.value,
        // Other inputs
      });

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
                  return h('iframe', {
                    src: `https://player.vimeo.com/video/${video.videoId.value}?title =0&byline=0&portrait=0`,
                    width: 640,
                    height: 360,
                    frameborder: 0,
                    webkitallowfullscreen: true,
                    mozallowfullscreen: true,
                    allowfullscreen: true,
                  });
                  //  `<iframe class="hosted-video__wrapper"
                  //           src="https://player.vimeo.com/video/${video.videoId.value}?title =0&byline =0&portrait =0"
                  //           width="640"
                  //           height="360"
                  //           frameborder="0"
                  //           webkitallowfullscreen
                  //           mozallowfullscreen
                  //           allowfullscreen
                  //           >
                  //   </iframe>`;
                } else if (
                  video.videoHost.value.find(
                    (item) => item.codename === 'youtube'
                  )
                ) {
                  return h('iframe', {
                    src: `https://www.youtube.com/embed/${video.videoId.value}`,
                    width: 640,
                    height: 315,
                    frameborder: 0,
                    allowfullscreen: true,
                  });
                  // return `<iframe class="hosted-video__wrapper"
                  //               width="560"
                  //               height="315"
                  //               src="https://www.youtube.com/embed/${video.videoId.value}"
                  //               frameborder="0"
                  //               allowfullscreen
                  //               >
                  //       </iframe>`;
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

          // TODO -> is that correct approach
          const element = h(domNode.tagName, domNode.attributes, childElements);
          return element;
        }

        if (domNode.type === 'text') {
          return domNode.content;
        }

        throw new Error('Undefined state');
      };

      return parsedTree.childNodes.map(link);
    },
  },
  render() {
    return this.resolvedValue;
  },
};
</script>
