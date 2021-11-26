<route lang="toml">
# if use `paths` can't set name attribute
# ! name ='Admin'
paths = ["/user","/data"]
</route>

<template lang="pug">
p Test layout
router-view
</template>

<script lang="ts">
export default {

}
</script>

<style>

</style>
