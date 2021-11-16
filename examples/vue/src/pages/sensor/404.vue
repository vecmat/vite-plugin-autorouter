
<route lang="toml">
name="sensor"
path="/:path(.*)*"
</route>

<template>
  <div>Inside 404 for {{path}}</div>

</template>

<script lang="ts" setup>
defineProps({
  path: Array|| String

})

</script>