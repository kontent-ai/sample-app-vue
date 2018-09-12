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
import { BrewerStore } from '../Stores/Brewer'
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
      this.name = newBrewer.productName.value;
      this.imageLink = newBrewer.image.value[0].url;
      this.descriptionElement = newBrewer.longDescription;
    },
    language: function(){
      BrewerStore.provideBrewer(this.$route.params.brewerSlug, this.language);
    }
  },
  methods:{
    onChange: function(){
      this.brewer = BrewerStore.getBrewer(this.$route.params.brewerSlug, this.language);
    }
  },
  mounted: function(){
    BrewerStore.subscribe();
    BrewerStore.addChangeListener(this.onChange);
    BrewerStore.provideBrewer(this.$route.params.brewerSlug, this.language);
    this.brewer = BrewerStore.getBrewer(this.$route.params.brewerSlug, this.language);
  },
  beforeDestroy: function() {
    BrewerStore.unsubscribe();
  },
  destroyed: function(){
    BrewerStore.removeChangeListener(this.onChange);
  },
  components: {
    RichTextElement,
  },
}
</script>