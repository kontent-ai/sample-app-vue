<template>
    <div class="container">
        <template  v-for="(article, index) in articlesData">
            <div :key="article.id">
                <div
                    v-if="index % 4 === 0"
                    class="clear"
                >
                </div>
                <div class="col-md-3" >
                    <div class="article-tile">
                        <router-link :to="article.link">
                            <img
                                v-if="article.imageLink"
                                :alt="'Article '  + article.title"
                                class="article-tile-image"
                                :src="article.imageLink"
                                :title="'Article ' + article.title"
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
    </div>
</template>

<script>
import dateFormat from 'dateformat';
import { ArticleStore } from '../Stores/Article';
import { dateFormats } from '../Utilities/LanguageCodes';
import _ from 'lodash';

export default {
  name: 'Articles',
  props: ['language'],
  data: () => ({
    articles: [],
    articleCount: 10
  }),
  computed: {
    articlesData: function() {
      return this.articles.map(article => ({
        title: _.get(article, 'title.value') || this.$t('Article.noTitleValue'),
        imageLink: _.get(article, 'teaserImage.value[0].url'),
        link: `/${this.language}/articles/${_.get(article, 'system.id')}`,
        postDate: this.formatDate(_.get(article, 'postDate.value')),
        summary: _.get(article, 'summary.value') || this.$t('Article.noSummaryValue')
      }));
    }
  },
  watch: {
    language: function() {
      ArticleStore.provideArticles(this.articleCount, this.language);
      dateFormat.i18n = dateFormats[this.language] || dateFormats[0];
    }
  },
  methods: {
    formatDate: function(value) {
      return value ? dateFormat(value, 'mmmm d') : this.$t('Article.noPostDateValue');
    },
    onChange: function() {
      this.articles = ArticleStore.getArticles(
        this.articleCount,
        this.language
      );
    }
  },
  mounted: function() {
    ArticleStore.subscribe();
    ArticleStore.addChangeListener(this.onChange);
    ArticleStore.provideArticles(this.articleCount, this.language);
    this.articles = ArticleStore.getArticles(this.articleCount, this.language);
    dateFormat.i18n = dateFormats[this.language] || dateFormats[0];
  },
  beforeDestroy: function() {
    ArticleStore.unsubscribe();
  },
  destroyed: function() {
    ArticleStore.removeChangeListener(this.onChange);
  }
};
</script>