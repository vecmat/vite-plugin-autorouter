<route lang="toml">
name ='zzz'
path = '/:captured(.*)*'
[meta]
pppck="asdfasdf"
</route>

<template lang="pug">
p 404 page {{captured?.join("/")}}

</template>




<script lang="ts" setup>
defineProps({
  captured: Array
})

</script>

<style>

</style>
