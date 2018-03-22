<template>
    <div v-if="!article" class="container"></div>
    <div v-else class="container">
        <article class="article-detail col-lg-9 col-md-12 article-detail-related-box">
            <h2>{{articleData.title}}</h2>
            <div class="article-detail-datetime">
                {{articleData.postDate}}
            </div>
            <div class="row">
                <div class="article-detail-image col-md-push-2 col-md-8">
                    <img :alt="articleData.title" class="img-responsive" :src="articleData.imageLink" :title="articleData.title" />
                </div>
            </div>
            <div class="row">
                <RichTextElement styleClass="article-detail-content" :element="articleData.bodyCopyElement" />
            </div>
        </article>
    </div>
</template>

<script>
    import ArticleStore from '../Stores/Article'
    import dateFormat from 'dateformat';
    import { dateFormats } from '../Utilities/LanguageCodes'
    import RichTextElement from './RichTextElement.vue'

    export default {
        name: "Article",
        props: ['language'],
        data: () => ({
            article: null,
        }),
        computed: {
            articleData: function(){
                return ({
                    title: this.article.title.value,
                    imageLink: this.article.teaserImage.value[0].url,
                    postDate: this.formatDate(this.article.postDate.value),
                    bodyCopyElement: this.article.bodyCopy,
                })
            }
        },
        created: function(){
            ArticleStore.addChangeListener(this.onChange);
            ArticleStore.provideArticle(this.$route.params.articleName, this.language);
            this.article = ArticleStore.getArticle(this.$route.params.articleName, this.language);
        },
        methods: {
            formatDate: function(value){
                return dateFormat(value, "dddd, mmmm d, yyyy");
            },
            onChange: function(){
                this.article = ArticleStore.getArticle(this.$route.params.articleName, this.language);
            }
        },
        watch: {
            language: function(){
                ArticleStore.provideArticle(this.$route.params.articleName, this.language);
                dateFormat.i18n = dateFormats[this.language] || dateFormats[0];
            }
        },
        components: {
            RichTextElement
        },
        destroyed: function(){
            ArticleStore.removeChangeListener(this.onChange);
        }

    }
</script>