<template>
    <div class="container">
        <template  v-for="(article, index) in articlesData" :key="article.id">
            <div>
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

<script setup>
import dateFormat from 'dateformat';
import { initLanguageCodeObject, defaultLanguage } from '../Utilities/LanguageCodes';
import _ from 'lodash';
import { Client } from '../Client.js';
import { useI18n } from 'vue-i18n';
import { onMounted, ref, watch } from 'vue';

const { locale, t } = useI18n();

//const articleCount = 10;
let articles = [];

const articlesData = ref([]);

const formatDate = (value) =>
  value ? dateFormat(value, 'mmmm d') : this.$t('Article.noPostDateValue');

const fetchArticles = () => {
  const articleList = initLanguageCodeObject();
  let query = Client.items()
    .type('article')
    .orderParameter('elements.post_date', 'desc');

  if (locale.value) {
    query.languageParameter(locale.value);
  }

  query.toPromise()
    .then(response => {
      if (locale.value) {
        articleList[locale.value] = response.data.items;
      } else {
        articleList[defaultLanguage] = response.data.items
      }
      articles = locale.value ? articleList[locale.value] : articleList[defaultLanguage];
      articlesData.value = articles.map(article => ({
        title: _.get(article, 'elements.title.value') || t('Article.noTitleValue'),
        imageLink: _.get(article, 'elements.teaserImage.value[0].url'),
        link: `/${locale.value.toLowerCase()}/articles/${_.get(article, 'system.id')}`,
        postDate: formatDate(_.get(article, 'elements.postDate.value')),
        summary: _.get(article, 'elements.summary.value') || this.$t('Article.noSummaryValue')
      }));
    });  
}

onMounted(() => fetchArticles())

watch(locale, () => { 
  fetchArticles()
});
</script>