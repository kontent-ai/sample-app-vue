<template>
    <div v-if="articles.length === 0" class="row">

    </div>
    <div v-else class="row">
        <h1 class="title-tab">{{title}}</h1>
        <div class="article-tile article-tile-large">
            <div class="col-md-12 col-lg-6">
                <router-link :to="'/en-us/articles/' + articles[0].urlPattern.value">
                <img v-bind:alt="articles[0].title.value" class="article-tile-image" v-bind:src="articles[0].teaserImage.value[0].url" v-bind:title="articles[0].title.value" />
                </router-link>
            </div>
            <div class="col-md-12 col-lg-6">
                <div class="article-tile-date">
                    {{formatDate(articles[0].postDate.value)}}
                </div>
                <div class="article-tile-content">
                    <h2>
                        <router-link :to="'/en-us/articles/' + articles[0].urlPattern.value">{{articles[0].title.value}}</router-link>
                    </h2>
                    <p class="article-tile-text lead-paragraph">
                        {{articles[0].summary.value}}
                    </p>
                </div>
            </div>
        </div>
        <!--OTHER ARTICLES-->
        <!--TODO key in list rendering?-->
        <div v-for="article in articles.slice(1)" class="col-md-3" >
            <div class="article-tile">
                <router-link :to="`/${language}/articles/` + article.urlPattern.value">
                <img v-bind:alt="'Article' + article.title.value" class="article-tile-image" v-bind:src="article.teaserImage.value[0].url" v-bind:title="'Article' + article.title.value" />
                </router-link>
                <div class="article-tile-date">
                    {{formatDate(article.postDate.value)}}
                </div>
                <div class="article-tile-content">
                    <h2 class="h4">
                        <router-link :to="`/${language}/articles/` + article.urlPattern.value">{{article.title.value}}</router-link>
                    </h2>
                    <p class="article-tile-text">
                        {{article.summary.value}}
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

    export default {
        name: "latest-articles",
        data: () => ({
            articles: [],
            articlesCount: 5,
            title: "Latest articles",
        }),
        props: ['language'],
        created: function(){
            ArticleStore.getArticles(this.articlesCount, this.language).then((articles) => this.articles = articles);
        },
        methods: {
            formatDate: function(value){
                return dateFormat(value, "mmmm d");
            }
        }

    }
</script>

