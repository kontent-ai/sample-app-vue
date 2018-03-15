<template>
    <div :class="styleClass" v-html="element.getHtml()" />
</template>

<script>
    export default {
        name: "RichTextElement",
        props: ['styleClass', 'element', 'history', 'match'],
    }
</script>