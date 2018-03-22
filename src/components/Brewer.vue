<template>
    <div class="container" v-if="!brewer">
        No brewer
    </div>
    <div class="container" v-else>
        <article class="product-detail">
            <div class="row">
                <div class="col-md-12">
                    <header>
                        <h2>{{name}}</h2>
                    </header>
                </div>
            </div>
            <div class="row-fluid">
                <div class="col-lg-7 col-md-6">
                    <figure class="image">
                        <img :alt="name" class="" :src="imageLink" :title="name" />
                    </figure>
                    <div class="description">
                        <!--TODO should not be null sent here-->
                        <RichTextElement v-if="descriptionElement" :element="descriptionElement" />
                    </div>
                </div>
            </div>
        </article>
    </div>
</template>

<script>
    import BrewerStore from '../Stores/Brewer'
    import RichTextElement from './RichTextElement.vue'

    export default {
        name: "Brewer",
        data: () => ({
            brewer: null,
            name: "",
            imageLink: "",
            descriptionElement: null,
        }),
        props: ['language'],
        watch: {
            brewer: function(newBrewer){
                if(!newBrewer){
                    return;
                }
                this.name = newBrewer.productName.value;
                this.imageLink = newBrewer.image.value[0].url;
                this.descriptionElement = newBrewer.longDescription;
            }
        },
        created: function(){
//            TODO when someone goes directly to this url, not through store
            this.brewer = BrewerStore.getBrewer(this.$route.params.brewerSlug, this.language);
        },
        components: {
            RichTextElement,
        }
    }
</script>