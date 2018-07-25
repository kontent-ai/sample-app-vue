<template>
    <div class="container">
        <div v-for="(fact, index) in factsData" :key="index">
            <section v-if="index % 2 === 0" class="row text-and-image" :key="index">
                <h2 class="col-lg-12">{{fact.title}}</h2>
                <div class="col-md-6">
                    <RichTextElement class="text-and-image-text" :element="fact.descriptionElement"/>
                </div>
                <div class="col-md-6">
                    <img :alt="fact.title" class="img-responsive" :src="fact.imageLink" :title="fact.title"/>
                </div>
            </section>
            <section v-else class="row text-and-image" :key="index">
                <h2 class="col-lg-12">{{fact.title}}</h2>
                <div class="col-md-6 col-md-push-6">
                    <RichTextElement class="text-and-image-text-right" :element="fact.descriptionElement"/>
                </div>
                <div class="col-md-6 col-md-pull-6">
                    <img :alt="fact.title" class="img-responsive" :src="fact.imageLink" :title="fact.title"/>
                </div>
            </section>
        </div>

    </div>
</template>

<script>
    import { FactStore } from '../Stores/Fact'
    import RichTextElement from './RichTextElement.vue'

    export default {
        name: "About",
        props: ['language'],
        data: () => ({
            facts: [],
        }),
        computed: {
            factsData: function () {
                return this.facts.map(fact => ({
                    title: fact.title.value,
                    descriptionElement: fact.description,
                    imageLink: fact.image.value[0].url,
                }))
            }
        },
        watch: {
            language: function () {
                FactStore.provideFacts(this.language);
            }
        },
        methods: {
            onChange: function () {
                this.facts = FactStore.getFacts(this.language);
            }
        },
        created: function () {
            FactStore.addChangeListener(this.onChange);
            FactStore.provideFacts(this.language);
            this.facts = FactStore.getFacts(this.language);
        },
        destroyed: function () {
            FactStore.removeChangeListener(this.onChange);
        },
        components: {
            RichTextElement,
        },
    }
</script>