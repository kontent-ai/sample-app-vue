<template>
    <div class="container">
        <template  v-for="(article, index) in articles">
            <div v-if="index % 4 === 0" class="clear" :key="getNextKey()">

            </div>
            <div class="col-md-3" :key="getNextKey()">
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
        </template>
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
        props: ['language'],
        methods: {
            formatDate: function(value){
                return dateFormat(value, "mmmm d");
            },
            getArticleLink: function(article){
                return `/${this.language}/articles/${article.urlPattern.value}`;
            },
            getNextKey: function(){
                return this.counter++;
            },
            getArticlesData: function(){
                ArticleStore.getArticles(10, this.language).then((articles) => this.articles = articles);

            }
        },
        updated: function(){
            this.counter = 0;
        },
        created: function(){
            this.getArticlesData();
            this.counter = 0;
        },
        watch: {
            language: function(){
                this.getArticlesData();
            }
        }
    }
</script>

