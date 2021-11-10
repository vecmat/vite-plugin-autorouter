import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import Auto from "../../dist";
import Markdown from "vite-plugin-md";
import Restart from "vite-plugin-restart";

const config = defineConfig({
    plugins: [
        Vue({
            include: [/\.vue$/, /\.md$/],
        }),
        Auto({
            pagesDir: [
                "src/pages",
                "src/features/admin/pages" 
            ],
            extensions: ["vue", "md"],
            syncIndex: false,
            replaceSquareBrackets: true,
            nuxtStyle: true,
        }),
        Markdown(),
        Restart({
            restart: ["../../dist/*.js"],
        }),
    ],
});

export default config;
