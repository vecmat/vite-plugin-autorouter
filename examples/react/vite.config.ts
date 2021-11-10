import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import Auto from "../../dist";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        reactRefresh(),
        Auto({
            pagesDir: [
                "src/pages",
                "src/features/admin/pages"
            ],
            extensions: ["tsx"],
            react: true,
        }),
    ],
});
