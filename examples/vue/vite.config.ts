
import { resolve } from "path";
import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import Markdown from "vite-plugin-md";
import Restart from "vite-plugin-restart";
import Auto from "../../dist/";

const config = defineConfig({
    plugins: [
        Vue({
            include: [/\.vue$/, /\.md$/],
        }),
        Auto({
            pagesDir: [
                "./layout/",
                "src/admin/pages/",
                "src/features/**/pages",
                resolve(__dirname, "./src/pages"),
            ],
            syncIndex: true,
            extensions: ["vue", "md"],
            extendRoute(route: any) {
                // if (route.name === "about") {
                //     route.props = (route: any) => ({ query: route.query.q });
                // }
                if (route.name === "components") {
                    return {
                        ...route,
                        beforeEnter: (route: any) => {
                            // eslint-disable-next-line no-console
                            console.log(route);
                        },
                    };
                }
            },
        }),
        Markdown(),
        Restart({
            restart: ["../../dist/"],
        }),
    ],
});

export default config;
