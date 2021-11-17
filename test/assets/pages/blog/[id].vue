
<route>
{
  meta: {
    requiresAuth: false,
  },
  name: 'name-override',
}
</route>

<template>
  blog/[id].vue: {{ id }}
</template>

<script setup lang="ts">
defineProps({
  id: String,
})

</script>
