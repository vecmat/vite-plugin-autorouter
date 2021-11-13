<route lang="toml">
name ='zzz'
path = '[...]'

</route>

<template lang="pug">
p 404 page {{pathMatch?.join("/")}}

</template>




<script lang="ts" setup>
defineProps({
  pathMatch: Array
})

</script>

<style>

</style>
