<script setup lang="ts">
defineProps({
  id: String,
})

</script>

<template>
  blog/[id].vue: {{ id }}
</template>
<route lang="toml">
name ='blog'
layout= true
path = '/:id'
[meta]
requiresAuth=true
</route>
