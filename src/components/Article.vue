<template>
    <div
        v-if="!articleData"
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
                    >{{ $t('Article.noTeaserValue') }}</span>
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
                >{{ $t('Article.noBodyCopyValue')}}</span>
            </div>
        </article>
    </div>
</template>

<script setup lang="ts">
import dateFormat from 'dateformat';
import {initLanguageCodeObject, defaultLanguage } from '../Utilities/LanguageCodes';
import RichTextElement from './RichTextElement.vue';
import { Client } from '../Client.js';
import { resolveChangeLanguageLink } from '../Utilities/RouterLink';
import { useI18n } from 'vue-i18n';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { computed } from '@vue/reactivity';
import type { Article } from '@/models';
import type { Elements } from '@kontent-ai/delivery-sdk';

interface ArticleData {
  title: string,
  imageLink: string,
  postDate: string,
  bodyCopyElement: Elements.RichTextElement
}

const { locale, t } = useI18n();
const article = ref<Article | null>(null);
const articleData = computed<ArticleData | null>(() => { 
  if(article.value === null){
    return null;
  }

  return {
    title: article.value?.elements.title.value ?? t('Article.noTitleValue'),
    imageLink: article.value?.elements.teaserImage.value[0].url,
    postDate: formatDate(article.value?.elements.postDate.value ?? ""),
    bodyCopyElement: article.value?.elements.bodyCopy ?? t('Article.noBodyCopyValue')
  }
})

const route = useRoute();

const router = useRouter();

const formatDate = (value: string) => 
    value ? dateFormat(value, 'dddd, mmmm d, yyyy') : t('Article.noPostDateValue');

const fetchArticle = (articleId: string) => {
  const articleDetails = initLanguageCodeObject();
  let query = Client.items<Article>()
    .type('article')
    .equalsFilter('system.id', articleId)
    .elementsParameter(['title', 'teaser_image', 'post_date', 'body_copy', 'video_host', 'video_id', 'tweet_link', 'theme', 'display_options'])

  if (locale.value) {
    query.languageParameter(locale.value);
  }

  query.toPromise()
    .then(response => {
      if (locale.value) {
        articleDetails[locale.value][articleId] = response.data.items[0];
      } else {
        articleDetails[defaultLanguage][articleId] = response.data.items[0];
      }

      article.value = locale.value ? articleDetails[locale.value][articleId] : articleDetails[defaultLanguage][articleId];

      if(article.value?.system.language !== locale.value) {
        router.replace({path: resolveChangeLanguageLink(route.path, article.value?.system.language)});
      }
    });
}

onMounted(() => {
  fetchArticle(route.params.articleId as string);
})

watch(locale, () => {
  fetchArticle(route.params.articleId as string)
});

</script>