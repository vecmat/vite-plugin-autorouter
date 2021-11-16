<template>
  <div>nested /sensor view:</div>
  <hr>
  <router-view />
</template>

<route lang="toml">
name="sensor"
</route>

<script lang="ts" setup>
/* 
! WARN: If set `props = true`, the outer component needs 
! to define component props.
*/
defineProps({
  path : Array
})
</script>