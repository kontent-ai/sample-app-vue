<template>
    <div class="container" >
        <div v-for="(fact, index) in facts">
            <section v-if="index % 2 === 0" class="row text-and-image" :key="index" >
                <h2 class="col-lg-12">{{getTitle(fact)}}</h2>
                <div class="col-md-6">
                    <RichTextElement styleClass="text-and-image-text" :element="getDescriptionElement(fact)" />
                </div>
                <div class="col-md-6">
                    <img :alt="getTitle(fact)" class="img-responsive" :src="getImageLink(fact)" :title="getTitle(fact)" />
                </div>
            </section>
            <section class="row text-and-image" :key="index" v-else>
                <h2 class="col-lg-12">{{getTitle(fact)}}</h2>
                <div class="col-md-6 col-md-push-6">
                    <RichTextElement styleClass="text-and-image-text-right" :element="getDescriptionElement(fact)" />
                </div>
                <div class="col-md-6 col-md-pull-6">
                    <img :alt="getTitle(fact)" class="img-responsive" :src="getImageLink(fact)" :title="getTitle(fact)" />
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
            getTitle: function(fact){
                return fact.title.value;
            },
            getDescriptionElement: function(fact){
                return fact.description;
            },
            getImageLink: function(fact){
                return fact.image.value[0].url;
            },
            getFactsData: function(){
                FactStore.getFacts(this.language).then(facts => this.facts = facts);
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