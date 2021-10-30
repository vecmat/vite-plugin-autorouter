import { resolve } from "path";
import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import Auto from "vite-plugin-autorouter";
import Markdown from "vite-plugin-md";
import Restart from "vite-plugin-restart";

const config = defineConfig({
    plugins: [
        Vue({
            include: [/\.vue$/, /\.md$/],
        }),
        Auto({
            // pagesDir: ['src/pages', 'src/pages2'],
            pagesDir: [
                // issue #68
                { dir: resolve(__dirname, "./src/pages"), baseRoute: "" },
                { dir: "src/features/**/pages", baseRoute: "features" },
                { dir: "src/admin/pages", baseRoute: "admin" },
            ],
            extensions: ["vue", "md"],
            syncIndex: true,
            replaceSquareBrackets: true,
            extendRoute(route) {
                if (route.name === "about") route.props = (route) => ({ query: route.query.q });

                if (route.name === "components") {
                    return {
                        ...route,
                        beforeEnter: (route) => {
                            // eslint-disable-next-line no-console
                            console.log(route);
                        },
                    };
                }
            },
        }),
        Markdown(),
        Restart({
            restart: ["../../dist/*.js"],
        }),
    ],
});

export default config;
