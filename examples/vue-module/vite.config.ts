import { resolve } from "path";
import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import Auto from "../../dist/";
import Markdown from "vite-plugin-md";
const config = defineConfig({
    plugins: [
        Vue({
            include: [/\.vue$/, /\.md$/],
        }),
        Auto({
            // pagesDir: ['src/pages', 'src/pages2'],
            pagesDir: [
                "src/admin/pages",
                "src/features/**/pages",
                resolve(__dirname, "./src/pages"),
            ],
            extensions: ["vue", "md"],
            syncIndex: true,
            replaceSquareBrackets: true,
            extendRoute(route:any) {
                if (route.name === "about") {
                    route.props = (route:any) => ({ 
                        query: route.query.q 
                    });
                }
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
    ],
});

export default config;
