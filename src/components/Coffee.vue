<template>
    <div
        class="container"
        v-if="!coffee"
    >
    </div>
    <div
        class="container"
        v-else
    >
        <article
            v-if="coffee"
            class="product-detail"
        >
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
                        <div class="product-detail-properties">
                            <h4>Parameters</h4>
                            <dl class="row">
                                <dt class="col-xs-12 col-sm-4">Farm</dt>
                                <dd class="col-xs-12 col-sm-8">{{farm}}</dd>
                                <dt class="col-xs-12 col-sm-4">Variety</dt>
                                <dd class="col-xs-12 col-sm-8">{{variety}}</dd>
                                <dt class="col-xs-12 col-sm-4">Processing</dt>
                                <dd class="col-xs-12 col-sm-8">{{processing}}</dd>
                                <dt class="col-xs-12 col-sm-4">Altitude</dt>
                                <dd class="col-xs-12 col-sm-8">{{altitude}}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    </div>
</template>

<script>
import { CoffeeStore } from '../Stores/Coffee'
import RichTextElement from './RichTextElement.vue'
import { Client } from '../Client.js';

export default {
  name: 'Coffee',
  props: ['language'],
  data: () => ({
    coffee: null,
  }),
  computed: {
    name: function () {
      return this.coffee ? this.coffee.elements.productName.value : ''
    },
    imageLink: function () {
      return this.coffee ? this.coffee.elements.image.value[0].url : ''
    },
    descriptionElement: function () {
      return this.coffee ? this.coffee.elements.longDescription : null
    },
    farm: function () {
      return this.coffee ? this.coffee.elements.farm.value : ''
    },
    variety: function () {
      return this.coffee ? this.coffee.elements.variety.value : ''
    },
    processing: function () {
      return this.coffee && this.coffee.elements.processing.value.length > 0 ? this.coffee.elements.processing.value[0].name : ''
    },
    altitude: function () {
      return this.coffee ? this.coffee.elements.altitude.value + ' feet' : ''
    },
  },
  watch: {
    language: function () {
      CoffeeStore.provideCoffee(this.$route.params.coffeeSlug, this.language);
    }
  },
  methods: {
    fetchData: function () {
      var query = Client.items()
        .type('coffee')
        .equalsFilter('url_pattern', this.$route.params.coffeeSlug)

      if(this.language){
        query.languageParameter(this.language)
      }
      query
        .toPromise()
        .then(response => {
          this.coffee = response.data.items[0]
        })
    }
  },
  mounted: function() {
    this.fetchData();
  },

  components: {
    RichTextElement,
  },
}
</script>