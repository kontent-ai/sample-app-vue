<template>
  <div class="container">
    <template v-for="(article, index) in articlesData" :key="article.id">
      <div>
        <div v-if="index % 4 === 0" class="clear"></div>
        <div class="col-md-3">
          <div class="article-tile">
            <router-link :to="article.link">
              <img
                v-if="article.imageLink"
                :alt="'Article ' + article.title"
                class="article-tile-image"
                :src="article.imageLink"
                :title="'Article ' + article.title"
              />
              <span v-else class="article-tile-image">{{
                $t('Article.noTeaserValue')
              }}</span>
            </router-link>
            <div class="article-tile-date">
              {{ article.postDate }}
            </div>
            <div class="article-tile-content">
              <h2 class="h4">
                <router-link :to="article.link">{{
                  article.title
                }}</router-link>
              </h2>
              <p class="article-tile-text">
                {{ article.summary }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity';
import dateFormat from 'dateformat';
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import type { Article } from '@/models';

import { defaultLanguage, initLanguageCodeObjectWithArray } from '../Utilities/LanguageCodes'
import { injectClient } from '@/Utilities/Symbols';

interface ArticleData {
  title: string;
  imageLink: string;
  link: string;
  postDate: string;
  summary: string;
}

const Client = injectClient();

const { locale, t } = useI18n();
const articles = ref<Array<Article>>([]);

const articlesData = computed<Array<ArticleData>>(() =>
  articles.value.map((article) => ({
    title: article.elements.title.value,
    imageLink: article.elements.teaserImage.value[0].url,
    link: `/${locale.value.toLowerCase()}/articles/${article.system.id}`,
    postDate: formatDate(article.elements.postDate.value ?? ''),
    summary: article.elements.summary.value,
  }))
);

const formatDate = (value: string): string =>
  value ? dateFormat(value, 'mmmm d') : t('Article.noPostDateValue');

const fetchArticles = () => {
  const articleList = initLanguageCodeObjectWithArray<Article>();
  const query = Client.value.items<Article>()
    .type('article')
    .orderParameter('elements.post_date', 'desc');

  if (locale.value) {
    query.languageParameter(locale.value);
  }

  query.toPromise().then((response) => {
    if (locale.value) {
      articleList[locale.value] = response.data.items;
    } else {
      articleList[defaultLanguage] = response.data.items;
    }
    articles.value = locale.value
      ? articleList[locale.value]
      : articleList[defaultLanguage];
  });
};

onMounted(() => fetchArticles());

watch(locale, () => {
  fetchArticles();
});
</script>
