import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import routes from "virtual:autorouter";
import App from "./App.vue";
import "./index.css";

// eslint-disable-next-line no-console
console.log(JSON.stringify(routes,null,4));

const router = createRouter({
    history: createWebHistory(),
    routes,
});
console.log(router)

const app = createApp(App);

app.use(router);

app.mount("#app");
