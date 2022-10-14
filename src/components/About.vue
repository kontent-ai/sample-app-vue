<template>
    <div class="container">
        <div
            v-for="(fact, index) in factsData"
            :key="index"
        >
            <section
                v-if="index % 2 === 0"
                class="row text-and-image"
            >
                <h2 class="col-lg-12">{{fact.title}}</h2>
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
            <section
                v-else
                class="row text-and-image"
            >
                <h2 class="col-lg-12">{{fact.title}}</h2>
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

<script setup>
import { defaultLanguage, initLanguageCodeObject } from '../Utilities/LanguageCodes';
import RichTextElement from './RichTextElement.vue';
import { Client } from '../Client.js';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';

const { locale } = useI18n();
const language = locale.value;

let facts = [];
const factsData = ref([]);

const fetchFacts =() => {
      const factsList = initLanguageCodeObject();
      var query = Client.items().type('about_us');

      if (language) {
        query.languageParameter(language);
      }

      query.toPromise()
        .then(response => {
          console.log(response)
          if (language) { 
            factsList[language] = response.data.items[0].elements.facts.linkedItems;
          } else {
            factsList[defaultLanguage] = response.data.items[0].elements.facts.linkedItems;
          }
          facts = language ? factsList[language] : factsList[defaultLanguage];
          factsData.value = facts.map(fact => ({
          title: fact.elements.title.value,
          descriptionElement: fact.elements.description,
          imageLink: fact.elements.image.value[0].url,
         }))
         console.log(factsData.value)
        });
  
      
    }

  // watch: {
  //   language: function () {
  //     this.fetchFacts();
  //   }
  // },
  
  onMounted(() => {
    fetchFacts();
  })
</script>