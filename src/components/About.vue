<template>
    <div class="container" >
        <div v-for="(fact, index) in computedFacts">
            <section v-if="index % 2 === 0" class="row text-and-image" :key="index" >
                <h2 class="col-lg-12">{{fact.title}}</h2>
                <div class="col-md-6">
                    <RichTextElement class="text-and-image-text" :element="fact.descriptionElement" />
                </div>
                <div class="col-md-6">
                    <img :alt="fact.title" class="img-responsive" :src="fact.imageLink" :title="fact.title" />
                </div>
            </section>
            <section v-else class="row text-and-image" :key="index" >
                <h2 class="col-lg-12">{{fact.title}}</h2>
                <div class="col-md-6 col-md-push-6">
                    <RichTextElement class="text-and-image-text-right" :element="fact.descriptionElement" />
                </div>
                <div class="col-md-6 col-md-pull-6">
                    <img :alt="fact.title" class="img-responsive" :src="fact.imageLink" :title="fact.title" />
                </div>
            </section>
        </div>

    </div>
</template>
<!--TODO optimize render above, if can be deeper, styleClass-->
<script>
    import RichTextElement from './RichTextElement.vue'
    import FactStore from '../Stores/Fact'

    export default {
        name: "About",
        data: () => ({
            facts: [],
        }),
        props: ['language'],
        methods: {
            getFactsData: function(){
                FactStore.getFacts(this.language).then(facts => this.facts = facts);
            }
        },
        computed: {
            computedFacts: function(){
                    return this.facts.map(fact => ({
                        title: fact.title.value,
                        descriptionElement: fact.description,
                        imageLink: fact.image.value[0].url,
                    }))


            }
        },
        components: {
            RichTextElement,
        },
        created : function(){
            this.getFactsData();
        },
        watch: {
            language: function(){
                this.getFactsData();
            }
        }
    }
</script>