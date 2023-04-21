<template>
      <iframe
      :src="src"
      :width="width"
      :height="height"
      :frameBorder="frameBorder"
      />
</template>

<script setup lang="ts">
const { src } =  defineProps<{
    src: string,
    width: number | string,
    height: number | string,
    frameBorder: number,
}>();
</script>