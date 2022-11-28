<template>
  <div class="row">
    <div class="clear center-text">
      <router-link :to="link" class="btn btn-more">
        {{ text }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
const { text, link } = defineProps<{
  text: string;
  link: string;
}>();
</script>
