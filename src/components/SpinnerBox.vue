<template>
  <div class="spinner-box">
    <span class="spinner"></span>
    <span class="spinner-message">{{message}}</span>
  </div>
</template>

<script>
  export default {
        name: "SpinnerBox",
        props:['message']
    }
</script>