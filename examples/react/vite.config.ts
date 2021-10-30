import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import Auto from "vite-plugin-autorouter";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        reactRefresh(),
        Auto({
            pagesDir: [
                { dir: "src/pages", baseRoute: "" },
                { dir: "src/features/admin/pages", baseRoute: "admin" },
            ],
            extensions: ["tsx"],
            react: true,
        }),
    ],
});
