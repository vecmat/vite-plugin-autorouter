import { ViteDevServer } from "vite";
import { getPagesVirtualModule, isRouteBlockChanged, isTarget, debug, slash } from "./utils";
import { removePage, addPage, updatePage } from "./pages";
import { ResolvedOptions, ResolvedPages } from "./types";

export function handleHMR(server: ViteDevServer, pages: ResolvedPages, options: ResolvedOptions, clearRoutes: () => void) {
    const { ws, watcher, } = server;

    function fullReload() {
        // invalidate module
        getPagesVirtualModule(server);
        clearRoutes();
        ws.send({
            type: "full-reload",
        });
    }

    watcher.on("add", async(file) => {
        file = slash(file)
        if (isTarget(file, options)) {
            await addPage(pages, file, options);
            debug.hmr("add", file);
            fullReload();
        }
    });
    watcher.on("unlink", (file) => {
        file = slash(file)
        if (isTarget(file, options)) {
            removePage(pages, file);
            debug.hmr("remove", file);
            fullReload();
        }
    });
    watcher.on("change", async(file) => {
        file = slash(file)
        if (isTarget(file, options) && !options.react) {
            const needReload = await isRouteBlockChanged(file, options);
            if (needReload) {
                console.log("change",file)
                updatePage(pages, file, options);
                debug.hmr("change", file);
                fullReload();
            }
        }
    });
}
