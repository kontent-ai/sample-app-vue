<template>
    <div
        v-if="articlesData.length === 0"
        class="row"
    >
    </div>
    <div
        v-else
        class="row"
    >
        <h1 class="title-tab">{{$t('LatestArticles.latestArticlesTitle')}}</h1>
        <div class="article-tile article-tile-large">
            <div class="col-md-12 col-lg-6">
                <router-link :to="articlesData[0].link">
                    <img
                        v-if="articlesData[0].imageLink"
                        v-bind:alt="articlesData[0].title"
                        class="article-tile-image"
                        v-bind:src="articlesData[0].imageLink"
                        v-bind:title="articlesData[0].title"
                    />
                    <span 
                        v-else 
                        class="article-tile-image"
                    >{{ $t('Article.noTeaserValue') }}</span>
                </router-link>
            </div>
            <div class="col-md-12 col-lg-6">
                <div class="article-tile-date">
                    {{articlesData[0].postDate}}
                </div>
                <div class="article-tile-content">
                    <h2>
                        <router-link :to="articlesData[0].link">{{articlesData[0].title}}</router-link>
                    </h2>
                    <p class="article-tile-text lead-paragraph">
                        {{articlesData[0].summary}}
                    </p>
                </div>
            </div>
        </div>
        <div
            v-for="(article, key) in articlesData.slice(1)"
            class="col-md-3"
            :key="key"
        >
            <div class="article-tile">
                <router-link :to="article.link">
                    <img
                        v-if="article.imageLink"
                        v-bind:alt="'Article' + article.title"
                        class="article-tile-image"
                        v-bind:src="article.imageLink"
                        v-bind:title="'Article' + article.title"
                    />
                    <span 
                        v-else 
                        class="article-tile-image"
                    >{{ $t('Article.noTeaserValue') }}</span>
                </router-link>
                <div class="article-tile-date">
                    {{article.postDate}}
                </div>
                <div class="article-tile-content">
                    <h2 class="h4">
                        <router-link :to="article.link">{{article.title}}</router-link>
                    </h2>
                    <p class="article-tile-text">
                        {{article.summary}}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ArticleStore } from '../Stores/Article'
import dateFormat from 'dateformat'
import { dateFormats } from '../Utilities/LanguageCodes'
import _ from 'lodash';

export default {
  name: 'latest-articles',
  props: ['language'],
  data: () => ({
    articles: [],
    articleCount: 5,
  }),
  computed: {
    articlesData: function(){
      return this.articles.map(article => ({
        imageLink: _.get(article, 'teaserImage.value[0].url'),
        postDate : this.formatDate(_.get(article, 'postDate.value')),
        summary :  _.get(article, 'summary.value') || this.$t('Article.noSummaryValue'),
        link : `/${this.language}/articles/${article.system.id}`,
      }))
    }
  },
  watch: {
    language: function(){
      ArticleStore.provideArticles(this.articleCount, this.language);
      dateFormat.i18n = dateFormats[this.language] || dateFormats[0];
    }
  },
  methods: {
    formatDate: function(value){
      return value ? dateFormat(value, 'mmmm d') : this.$t('Article.noPostDateValue');
    },
    onChange: function(){
      this.articles = ArticleStore.getArticles(this.articleCount, this.language);
    }
  },
  mounted: function(){
    ArticleStore.subscribe();
    ArticleStore.addChangeListener(this.onChange);
    ArticleStore.provideArticles(this.articleCount, this.language);
    dateFormat.i18n = dateFormats[this.language] || dateFormats[0];
    this.articles =  ArticleStore.getArticles(this.articleCount, this.language);
  },
  beforeDestroy: function() {
    ArticleStore.unsubscribe();
  },
  destroyed: function() {
    ArticleStore.removeChangeListener(this.onChange);
  }
}
</script>