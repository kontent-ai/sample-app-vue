<template>
    <div v-if="articlesData.length === 0" class="row">
    </div>
    <div v-else class="row">
        <h1 class="title-tab">{{$t('LatestArticles.latestArticlesTitle')}}</h1>
        <div class="article-tile article-tile-large">
            <div class="col-md-12 col-lg-6">
                <router-link :to="articlesData[0].link">
                <img v-bind:alt="articlesData[0].title" class="article-tile-image" v-bind:src="articlesData[0].imageLink" v-bind:title="articlesData[0].title" />
                </router-link>
            </div>
            <div class="col-md-12 col-lg-6">
                <div class="article-tile-date">
                    {{articlesData[0].postDate}}
                </div>
                <div class="article-tile-content">
                    <h2>
                        <router-link :to="articlesData[0].link">{{articlesData[0].title}}</router-link>
                    </h2>
                    <p class="article-tile-text lead-paragraph">
                        {{articlesData[0].summary}}
                    </p>
                </div>
            </div>
        </div>
        <!--OTHER ARTICLES-->
        <!--TODO key in list rendering?-->
        <div v-for="article in articlesData.slice(1)" class="col-md-3" >
            <div class="article-tile">
                <router-link :to="article.link">
                <img v-bind:alt="'Article' + article.title" class="article-tile-image" v-bind:src="article.imageLink" v-bind:title="'Article' + article.title" />
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
        <!--END OF OTHER ARTICLES-->
    </div>
</template>

<script>
    import ArticleStore from '../Stores/Article'
    import dateFormat from 'dateformat'
    import { dateFormats } from '../Utilities/LanguageCodes'


    export default {
        name: "latest-articles",
        data: () => ({
            articles: [],
            articleCount: 5,
        }),
        computed: {
            articlesData: function(){
                return this.articles.map(article => ({
                    imageLink : article.teaserImage.value[0].url,
                    postDate : this.formatDate(article.postDate.value),
                    summary : article.summary.value,
                    link : `/${this.language}/articles/${article.urlPattern.value}`,
                }))
            }
        },
        props: ['language'],
        created: function(){
            ArticleStore.addChangeListener(this.onChange);
            ArticleStore.provideArticles(this.articleCount, this.language);
            this.articles =  ArticleStore.getArticles(this.articleCount, this.language)

        },
        methods: {
//            TODO extract formatDate, repeats
            formatDate: function(value){
                return dateFormat(value, "mmmm d");
            },
            onChange: function(){
                this.articles = ArticleStore.getArticles(this.articleCount, this.language);
            }
        },
        watch: {
            language: function(){
                ArticleStore.provideArticles(this.articleCount, this.language);
                dateFormat.i18n = dateFormats[this.language] || dateFormats[0];
            }
        },
        destroyed: function() {
            ArticleStore.removeChangeListener(this.onChange);
        }

    }
</script>

