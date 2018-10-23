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
                        :alt="articleData.title"
                        class="img-responsive"
                        :src="articleData.imageLink"
                        :title="articleData.title"
                    />
                </div>
            </div>
            <div class="row">
                <RichTextElement
                    styleClass="article-detail-content"
                    :element="articleData.bodyCopyElement"
                />
            </div>
        </article>
    </div>
</template>

<script>
import { ArticleStore } from '../Stores/Article'
import dateFormat from 'dateformat';
import { dateFormats } from '../Utilities/LanguageCodes'
import RichTextElement from './RichTextElement.vue'
import { mapArticle } from '../Utilities/MapArticle';

export default {
  name: 'Article',
  props: ['language'],
  data: () => ({
    article: null,
  }),
  computed: {
    articleData: function(){
      return mapArticle(this.article);
    }
  },
  watch: {
    language: function(){
      ArticleStore.provideArticle(this.$route.params.articleId, this.language);
      dateFormat.i18n = dateFormats[this.language] || dateFormats[0];
    }
  },
  methods: {
    formatDate: function(value){
      return dateFormat(value, 'dddd, mmmm d, yyyy');
    },
    onChange: function(){
      this.article = ArticleStore.getArticle(this.$route.params.articleId, this.language);
    }
  },
  mounted: function(){
    ArticleStore.subscribe();
    ArticleStore.addChangeListener(this.onChange);
    ArticleStore.provideArticle(this.$route.params.articleId, this.language);
    dateFormat.i18n = dateFormats[this.language] || dateFormats[0];
    this.article = ArticleStore.getArticle(this.$route.params.articleId, this.language);
  },
  beforeUpdate: function(){
    this.article = ArticleStore.getArticle(this.$route.params.articleId, this.language);
  },
  beforeDestroy: function() {
    ArticleStore.unsubscribe();
  },
  destroyed: function(){
    ArticleStore.removeChangeListener(this.onChange);
  },
  components: {
    RichTextElement
  },

}
</script>