import { defineConfig } from "vite";
import VuePlugin from "@vitejs/plugin-vue";
import Auto from "vite-plugin-autorouter";
import Restart from "vite-plugin-restart";

const config = defineConfig({
    plugins: [
        VuePlugin(),
        Auto(),
        Restart({
            restart: ["../../dist/*.js"],
        }),
    ],
    build: {
        minify: false,
    },
});

export default config;
