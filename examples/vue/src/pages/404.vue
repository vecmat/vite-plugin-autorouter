<route lang="toml">
name ='zzz'
path = '/:level*'
[meta]
pppck="asdfasdf"
</route>

<template lang="pug">
p Global 404 page for :
| {{level}}

</template>

<script lang="ts" setup>
defineProps({
  level: Array
})

</script>