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
                        <h2>{{name}}</h2>
                    </header>
                </div>
            </div>
            <div class="row-fluid">
                <div class="col-lg-7 col-md-6">
                    <figure class="image">
                        <img
                            :alt="name"
                            class=""
                            :src="imageLink"
                            :title="name"
                        />
                    </figure>
                    <div class="description">
                        <RichTextElement
                            v-if="descriptionElement"
                            :element="descriptionElement"
                        />
                    </div>
                </div>
            </div>
        </article>
    </div>
</template>

<script>
import { Client } from '../Client.js';
import RichTextElement from './RichTextElement.vue'

export default {
  name: 'Brewer',
  props: ['language'],
  data: () => ({
    brewer: null,
    name: '',
    imageLink: '',
    descriptionElement: null,
  }),
  watch: {
    brewer: function(newBrewer){
      if(!newBrewer){
        return;
      }
      this.name = newBrewer.elements.productName.value;
      this.imageLink = newBrewer.elements.image.value[0].url;
      this.descriptionElement = newBrewer.elements.longDescription;
    },
    language: function(){
      this.fetchBrewer();
    }
  },
  methods:{
    fetchBrewer: function () {
      var query = Client.items()
        .type('brewer')
        .equalsFilter('url_pattern', this.$route.params.brewerSlug)

      if(this.language){
        query.languageParameter(this.language)
      }
      query
        .toPromise()
        .then(response => {
          debugger
          this.brewer = response.data.items[0]
        })
    }
  },
  mounted: function(){
    this.fetchBrewer();
  },
  components: {
    RichTextElement,
  },
}
</script>