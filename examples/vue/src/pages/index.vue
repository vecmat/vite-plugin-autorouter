<route lang="toml">
name= "PageIndex"
path= "/"
alias="/index"
</route>

<template>
    <div>
        <p>index.vue</p>
        <router-link to="/blog"> blog </router-link> <br>
        <router-link to="/about"> about </router-link> <br>
        <router-link to="/admin"> admin </router-link><br>
        <router-link to="/markdown"> markdown </router-link> <br>
        <router-link to="/components"> components </router-link> <br>
        <router-link to="/catch/index"> RegEXP  Match </router-link><br>
        <router-link to="/AAA/BBB/CCC/DDD/EEE/FFF"> Global Match (404) </router-link> 
    </div>
</template>

