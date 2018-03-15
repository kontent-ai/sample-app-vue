<template>
    <div class="container">
        <div v-for="(article, index) in articles" class="col-md-3" :key="index">
            <div v-if="index % 4 === 0" class="clear" :key="index"></div>
            <div class="article-tile">
                <router-link :to="getArticleLink(article)">
                <img :alt="'Article '  + article.title.value" class="article-tile-image" :src="article.teaserImage.value[0].url" :title="'Article ' + article.title.value" />
                </router-link>
                <div class="article-tile-date">
                    {{formatDate(article.postDate.value)}}
                </div>
                <div class="article-tile-content">
                    <h2 class="h4">
                        <router-link :to="getArticleLink(article)">{{article.title.value}}</router-link>
                    </h2>
                    <p class="article-tile-text">
                        {{article.summary.value}}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import dateFormat from 'dateformat';
    import ArticleStore from '../Stores/Article';

    export default {
        name: "Articles",
        data: () => ({
            articles: [],
        }),
        computed: {

        },
        methods: {
            formatDate: function(value){
                return dateFormat(value, "mmmm d");
            },
            getArticleLink: function(article){
                return '/en-us/articles/' + article.urlPattern.value;
            }
        },
        created: function(){
            ArticleStore.getArticles(10, 'en-US').then((articles) => this.articles = articles);

        }
    }
</script>

