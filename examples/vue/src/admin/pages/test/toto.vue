<route lang="toml">
name ='toto'
path = '/toto'
parent = ["main","test"]
</route>

<template lang="pug">
p /test/toto
router-view
</template>

<script lang="ts">
export default {

}
</script>

<style>

</style>
