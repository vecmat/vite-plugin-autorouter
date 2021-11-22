import { defineConfig } from "vite";
import VuePlugin from "@vitejs/plugin-vue";
import Auto from "vite-plugin-autorouter";
import Restart from "vite-plugin-restart";
import Markdown from "vite-plugin-md";
const config = defineConfig({
    plugins: [
        VuePlugin({ include: [/\.vue$/, /\.md$/],}),
        Auto({
            extensions: ["vue", "md"],
        }),
        Restart({
            restart: ["../../dist/*.js"],
        }),
        Markdown()
    ],
    build: {
        minify: false,
    },
});

export default config;
