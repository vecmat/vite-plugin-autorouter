<route lang="toml">
name ='blog'
[meta]
requiresAuth=true
</route>
<template>
  blog/[id].vue: {{ id }}
</template>

<script setup lang="ts">
defineProps({
  id: String,
})
</script>
