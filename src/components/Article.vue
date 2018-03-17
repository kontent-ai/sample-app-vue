<template>
    <div v-if="!article" class="container"></div>
    <div v-else class="container">
        <article class="article-detail col-lg-9 col-md-12 article-detail-related-box">
            <h2>{{article.title.value}}</h2>
            <div class="article-detail-datetime">
                {{formatDate(article.postDate.value)}}
            </div>
            <div class="row">
                <div class="article-detail-image col-md-push-2 col-md-8">
                    <img :alt="article.title.value" class="img-responsive" :src="article.teaserImage.value[0].url" :title="article.title.value" />
                </div>
            </div>
            <div class="row">
                <RichTextElement styleClass="article-detail-content" :element="article.bodyCopy" />
            </div>
        </article>
    </div>
</template>

<script>
    import ArticleStore from '../Stores/Article'
    import dateFormat from 'dateformat';
    import RichTextElement from './RichTextElement.vue'

    export default {
        name: "Article",
        data: () => ({
            article: null,
        }),
        props: ['language'],
        created: function(){
            ArticleStore.getArticle(this.$route.params.articleName, this.language).then(article => this.article = article);
        },
        methods: {
            formatDate: function(value){
                return dateFormat(value, "dddd, mmmm d, yyyy");
            }
        },
        components: {
            RichTextElement
        }

    }
</script>