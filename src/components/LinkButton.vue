<template>
    <div class="row">
        <div class="clear center-text">
            <router-link 
                :to="link" 
                class="btn btn-more"
            >
                {{text}}
            </router-link>
        </div>
    </div>
</template>

<script>
export default {
  name: 'link-button',
  props: ['text', 'link'],
}
</script>
