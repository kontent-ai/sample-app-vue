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

<script setup>
import dateFormat from 'dateformat'
import { dateFormats } from '../Utilities/LanguageCodes'
import { initLanguageCodeObject, defaultLanguage } from '../Utilities/LanguageCodes';
import _ from 'lodash';
import { Client } from '../Client.js';
import { useI18n } from 'vue-i18n';
import { onMounted, ref } from 'vue';

const { t, locale } = useI18n();
const articlesData = ref([]);
let articles = [];
const articleCount = 5
const language = locale.value

const formatDate = (value) => {
  return value ? dateFormat(value, 'mmmm d') : t('Article.noPostDateValue');
}

const fetchArticles = () => {
  const articleList = initLanguageCodeObject();
  let query = Client.items()
    .type('article')
    .orderParameter('elements.post_date', 'desc');

  if (language) {
    query.languageParameter(language);
  }
  
  query.toPromise()
    .then(response => {
      if (language) {
        articleList[language] = response.data.items;
      } else {
        articleList[defaultLanguage] = response.data.items
      }
      articles = language ? articleList[language].slice(0, articleCount) : articleList[defaultLanguage].slice(0, articleCount) ;
      articlesData.value = articles.map(article => ({
        imageLink: _.get(article, 'elements.teaserImage.value[0].url'),
        postDate : formatDate(_.get(article, 'elements.postDate.value')),
        summary :  _.get(article, 'elements.summary.value') || t('Article.noSummaryValue'),
        title: _.get(article, 'elements.title.value'),
        link : `/${language}/articles/${article.system.id}`,
      }))
    });  
}

onMounted(() => {
  dateFormat.i18n = dateFormats[language] || dateFormats[0];
  fetchArticles();
})
  // watch: {
  //   language: function(){
  //     this.fetchArticles();
  //     dateFormat.i18n = dateFormats[this.language] || dateFormats[0];
  //   }
  // },
</script>