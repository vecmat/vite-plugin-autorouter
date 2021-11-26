<template lang="pug">
| This is liar router
| file location ："/blog/liar.vue"
</template>

<route lang="toml">
name ='current'
path="liar"
parents = "$/about"
[meta]
requiresAuth=true
</route>
