<template>
    <div class="spinner-box">
        <span class="spinner"></span>
        <span class="spinner-message">{{props.message}}</span>
    </div>
</template>

<script setup>
const props = defineProps(['message']);
</script>