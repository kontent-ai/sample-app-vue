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
import { dateFormats } from '../Utilities/LanguageCodes';
import { initLanguageCodeObject, defaultLanguage } from '../Utilities/LanguageCodes';
import _ from 'lodash';
import { Client } from '../Client.js';

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
        title: _.get(article, 'elements.title.value') || this.$t('Article.noTitleValue'),
        imageLink: _.get(article, 'elements.teaserImage.value[0].url'),
        link: `/${this.language.toLowerCase()}/articles/${_.get(article, 'system.id')}`,
        postDate: this.formatDate(_.get(article, 'elements.postDate.value')),
        summary: _.get(article, 'elements.summary.value') || this.$t('Article.noSummaryValue')
      }));
    }
  },
  watch: {
    language: function() {
      this.fetchArticles();
      dateFormat.i18n = dateFormats[this.language] || dateFormats[0];
    }
  },
  methods: {
    formatDate: function(value) {
      return value ? dateFormat(value, 'mmmm d') : this.$t('Article.noPostDateValue');
    },
    fetchArticles: function() {
      const articleList = initLanguageCodeObject();
      let query = Client.items()
        .type('article')
        .orderParameter('elements.post_date', 'desc');

      if (this.language) {
        query.languageParameter(this.language);
      }

      query.toPromise()
        .then(response => {
          if (this.language) {
            articleList[this.language] = response.data.items;
          } else {
            articleList[defaultLanguage] = response.data.items
          }
          this.articles = this.language ? articleList[this.language] : articleList[defaultLanguage];
        });
    }
  },
  mounted: function() {
    this.fetchArticles();
    dateFormat.i18n = dateFormats[this.language] || dateFormats[0];
  },
};
</script>