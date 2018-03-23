<template>
    <div class="container">
        <template  v-for="(article, index) in articlesData">
            <div v-if="index % 4 === 0" class="clear" :key="getNextKey()">

            </div>
            <div class="col-md-3" :key="getNextKey()">
                <div class="article-tile">
                    <router-link :to="article.link">
                    <img :alt="'Article '  + article.title" class="article-tile-image" :src="article.imageLink" :title="'Article ' + article.title" />
                    </router-link>
                    <div class="article-tile-date">
                        {{article.postDate}}
                    </div>
                    <div class="article-tile-content">
                        <h2 class="h4">
                            <router-link :to="article.link">{{article.title}}</router-link>
                        </h2>
                        <p class="article-tile-text">
                            {{article.summary}}
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
    import { dateFormats } from '../Utilities/LanguageCodes'

    export default {
        name: "Articles",
        data: () => ({
            articles: [],
            articleCount: 10,
        }),
        computed: {
            articlesData: function(){
                return this.articles.map(article => ({
                    title: article.title.value,
                    imageLink : article.teaserImage.value[0].url,
                    postDate : this.formatDate(article.postDate.value),
                    summary : article.summary.value,
                    link : `/${this.language}/articles/${article.urlPattern.value}`,
                }))
            }
        },
        props: ['language'],
        methods: {
            formatDate: function(value){
                return dateFormat(value, "mmmm d");
            },
            getNextKey: function(){
//                wrong ids when switching languages
                console.log(this.counter);
                return this.counter++;
            },
            onChange: function(){
                this.articles = ArticleStore.getArticles(this.articleCount, this.language);
            }
        },
        created: function(){
            ArticleStore.addChangeListener(this.onChange);
            ArticleStore.provideArticles(this.articleCount, this.language);
            this.counter = 0;
            this.articles = ArticleStore.getArticles(this.articleCount, this.language);
            dateFormat.i18n = dateFormats[this.language] || dateFormats[0];

        },
        updated: function(){
            this.counter = 0;
        },
        watch: {
            language: function(){
                ArticleStore.provideArticles(this.articleCount, this.language);
                dateFormat.i18n = dateFormats[this.language] || dateFormats[0];
            }
        },
        destroyed: function(){
            ArticleStore.removeChangeListener(this.onChange);
        }
    }
</script>

