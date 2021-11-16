<route lang="toml">
name ='404'
path = '/:path*'
</route>

<template lang="pug">
p Sensor Inside 404 :
| {{ JSON.stringify(path)}}
</template>

<script lang="ts" setup>
defineProps({
  path : Array
})

</script>