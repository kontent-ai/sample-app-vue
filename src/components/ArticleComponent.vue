<template>
    <div
        v-if="!article"
        class="container"
    ></div>
    <div
        v-else
        class="container"
    >
        <article class="article-detail col-lg-9 col-md-12 article-detail-related-box">
            <h2>{{articleData.title}}</h2>
            <div class="article-detail-datetime">
                {{articleData.postDate}}
            </div>
            <div class="row">
                <div class="article-detail-image col-md-push-2 col-md-8">
                    <img
                        v-if="articleData.imageLink"
                        :alt="articleData.title"
                        class="img-responsive"
                        :src="articleData.imageLink"
                        :title="articleData.title"
                    />
                    <span 
                        v-else 
                        class="img-responsive"
                    >{{ $t('ArticleComponent.noTeaserValue') }}</span>
                </div>
            </div>
            <div class="row">
                <RichTextElement
                    v-if="articleData.bodyCopyElement"
                    class="article-detail-content"
                    :element="articleData.bodyCopyElement"
                />
                <span
                    v-else
                    class="article-detail-content"
                >{{ $t('ArticleComponent.noBodyCopyValue')}}</span>
            </div>
        </article>
    </div>
</template>

<script>
import dateFormat from 'dateformat';
import { dateFormats, initLanguageCodeObject, defaultLanguage } from '../Utilities/LanguageCodes';
import RichTextElement from './RichTextElement.vue';
import { Client } from '../Client.js';
import { resolveChangeLanguageLink } from '../Utilities/RouterLink';
import _ from 'lodash';

export default {
  name: 'ArticleComponent',
  props: ['language'],
  data: () => ({
    article: null,
  }),
  computed: {
    articleData: function() {
      return {
        title: _.get(this.article, 'elements.title.value') || this.$t('ArticleComponent.noTitleValue'),
        imageLink: _.get(this.article, 'elements.teaserImage.value[0].url'),
        postDate: this.formatDate(_.get(this.article, 'elements.postDate.value')),
        bodyCopyElement: _.get(this.article, 'elements.bodyCopy') || this.$t('ArticleComponent.noBodyCopyValue')
      };
    }
  },
  watch: {
    language: function(){
      this.fetchArticle(this.$route.params.articleId);
      dateFormat.i18n = dateFormats[this.language] || dateFormats[0];
    }
  },
  methods: {
    formatDate: function(value){
      return value ? dateFormat(value, 'dddd, mmmm d, yyyy') : this.$t('ArticleComponent.noPostDateValue');
    },
    fetchArticle: function(articleId){
      const articleDetails = initLanguageCodeObject();
      let query = Client.items()
        .type('article')
        .equalsFilter('system.id', articleId)
        .elementsParameter(['title', 'teaser_image', 'post_date', 'body_copy', 'video_host', 'video_id', 'tweet_link', 'theme', 'display_options'])

      if (this.language) {
        query.languageParameter(this.language);
      }

      query.toPromise()
        .then(response => {
          if (this.language) {
            articleDetails[this.language][articleId] = response.data.items[0];
          } else {
            articleDetails[defaultLanguage][articleId] = response.data.items[0];
          }
          this.article = this.language ? articleDetails[this.language][articleId] : articleDetails[defaultLanguage][articleId]

          if(this.article.system.language !== this.language) {
            this.$router.replace({path: resolveChangeLanguageLink(this.$route.path, this.article.system.language)})
          }
        });
    }
  },
  mounted: function(){
    this.fetchArticle(this.$route.params.articleId);
  },
  components: {
    RichTextElement
  }
}
</script>
