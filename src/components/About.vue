<template>
  <div class="container">
    <div v-for="(fact, index) in factsData" :key="index">
      <section v-if="index % 2 === 0" class="row text-and-image">
        <h2 class="col-lg-12">{{ fact.title }}</h2>
        <div class="col-md-6">
          <RichTextElement
            class="text-and-image-text"
            :element="fact.descriptionElement"
          />
        </div>
        <div class="col-md-6">
          <img
            :alt="fact.title"
            class="img-responsive"
            :src="fact.imageLink"
            :title="fact.title"
          />
        </div>
      </section>
      <section v-else class="row text-and-image">
        <h2 class="col-lg-12">{{ fact.title }}</h2>
        <div class="col-md-6 col-md-push-6">
          <RichTextElement
            class="text-and-image-text-right"
            :element="fact.descriptionElement"
          />
        </div>
        <div class="col-md-6 col-md-pull-6">
          <img
            :alt="fact.title"
            class="img-responsive"
            :src="fact.imageLink"
            :title="fact.title"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Elements } from '@kontent-ai/delivery-sdk';
import { computed } from '@vue/reactivity';
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import type { AboutUs, FactAboutUs } from '@/models';

import { defaultLanguage, initLanguageCodeObject } from '../Utilities/LanguageCodes'
import RichTextElement from './RichTextElement.vue';
import { injectClient } from '@/Utilities/Symbols';

interface FactsData {
  title: string;
  descriptionElement: Elements.RichTextElement;
  imageLink: string;
}

const Client = injectClient();

const { locale } = useI18n();
const facts = ref<Array<FactAboutUs>>([]);
const factsData = computed<Array<FactsData>>(() =>
  facts.value.map((fact) => ({
    title: fact.elements.title.value,
    descriptionElement: fact.elements.description,
    imageLink: fact.elements.image.value[0].url,
  }))
);

const fetchFacts = (): void => {
  const factsList = initLanguageCodeObject<AboutUs>();
  const query = Client.value.items<AboutUs>().type('about_us');

  if (locale.value) {
    query.languageParameter(locale.value);
  }

  query.toPromise().then((response) => {
    if (locale.value) {
      factsList[locale.value] = response.data.items[0];
    } else {
      factsList[defaultLanguage] = response.data.items[0];
    }

    facts.value = locale.value
      ? (factsList[locale.value]?.elements.facts
          .linkedItems as Array<FactAboutUs>)
      : (factsList[defaultLanguage]?.elements.facts
          .linkedItems as Array<FactAboutUs>);
  });
};

onMounted(() => {
  fetchFacts();
});

watch(locale, () => {
  fetchFacts();
});

</script>
