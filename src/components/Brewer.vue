<template>
    <div
        class="container"
        v-if="!brewer"
    >
    </div>
    <div
        class="container"
        v-else
    >
        <article class="product-detail">
            <div class="row">
                <div class="col-md-12">
                    <header>
                        <h2>{{data.name}}</h2>
                    </header>
                </div>
            </div>
            <div class="row-fluid">
                <div class="col-lg-7 col-md-6">
                    <figure class="image">
                        <img
                            :alt="data.name"
                            class=""
                            :src="data.imageLink"
                            :title="data.name"
                        />
                    </figure>
                    <div class="description">
                        <RichTextElement
                            v-if="data.descriptionElement"
                            :element="data.descriptionElement"
                        />
                    </div>
                </div>
            </div>
        </article>
    </div>
</template>

<script setup>
import { Client } from '../Client.js';
import RichTextElement from './RichTextElement.vue'
import { resolveChangeLanguageLink } from '../Utilities/RouterLink';
import { useI18n } from 'vue-i18n';
import { onMounted, ref, watch} from 'vue';
import { computed } from '@vue/reactivity';
import { useRoute, useRouter } from 'vue-router';

const { locale } = useI18n();
const route = useRoute();
const router = useRouter();

const brewer = ref(null);
const data = computed(() => ({
  name: brewer.value?.elements.productName.value ?? '',
  imageLink: brewer.value?.elements.image.value[0].url ?? '',
  descriptionElement: brewer.value?.elements.longDescription ?? '', 
}))

const fetchBrewer = () => {
  var query = Client.items()
        .type('brewer')
        .equalsFilter('url_pattern', route.params.brewerSlug)

  if(locale.value){
    query.languageParameter(locale.value)
  }

  query
    .toPromise()
    .then(response => {
      brewer.value = response.data.items[0]
      
      if(brewer.value.system.language !== locale.value) {
        router.replace({path: resolveChangeLanguageLink(route.path, brewer.value.system.language)})
      }
    })
}

onMounted(() => {
  fetchBrewer();
})

watch(locale, () => {
  fetchBrewer();
});
</script>