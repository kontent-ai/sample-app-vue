<template>
    <div v-html="element.getHtml()" @click="handleClick"/>
</template>

<script>
    import {resolveContentLink} from '../Utilities/ContentLinks'
    import {getLanguageCode} from '../Utilities/LanguageCodes'

    export default {
        name: "RichTextElement",
        props: ['element'],
        methods: {
            handleClick: function(e){
                if (e.target.tagName === "A" && e.target.hasAttribute("data-item-id")) {
                    e.preventDefault();

                    const id = e.target.getAttribute("data-item-id");
                    const link = this.element.links.find(m => m.itemId === id);

                    if (link) {
                        const path = resolveContentLink(link);
                        const language = this.$i18n.locale;

                        if (path) {
                            this.$router.push(`/${language}${path}`);
                        }
                    }
                }
            }
        }
    }
</script>