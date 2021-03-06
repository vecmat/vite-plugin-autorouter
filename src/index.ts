import { Route, ResolvedOptions, UserOptions, ResolvedPages } from "./types";
import { generateRoutes, generateClientCode } from "./generate";
import { debug, replaceSquareBrackets } from "./utils";
import { resolveOptions } from "./options";
import { MODULE_VIRTUAL_ID, MODULE_REQUEST_ID } from "./constants";
import { resolvePages } from "./pages";
import { handleHMR } from "./hmr";
import type { Plugin } from "vite";

function pagesPlugin(userOptions: UserOptions = {}): Plugin {
    let generatedRoutes: Route[] | null = null;
    let options: ResolvedOptions;
    let pages: ResolvedPages;

    return {
        name: "vite-plugin-autorouter",
        enforce: "pre",
        async transform(_code, id) {
            if (!/vue&type=route/.test(id)) 
                return;
            return {
                code: "export default {};",
                map: null,
            };
        },
        generateBundle(_options, bundle) {
            if (options.replaceSquareBrackets) 
                replaceSquareBrackets(bundle);
        },
        configureServer(server) {
            handleHMR(server, pages, options, () => {
                generatedRoutes = null;
            });
        },
        async configResolved({ root }) {
            options = resolveOptions(userOptions, root);
            pages = await resolvePages(options);
            debug.options(options);
            debug.pages(pages);
        },
        async load(id) {
            if (id !== MODULE_REQUEST_ID) return;
            if (!generatedRoutes) {
                generatedRoutes = [];
                try{
                    generatedRoutes = generateRoutes(pages, options);
                }catch(err:any){
                    console.error(err)
                }
                generatedRoutes = (await options.onRoutesGenerated?.(generatedRoutes)) || generatedRoutes;
            }
            debug.gen("routes: %O", generatedRoutes);
            let clientCode = generateClientCode(generatedRoutes, options);
            clientCode = (await options.onClientGenerated?.(clientCode)) || clientCode;
            debug.gen('client code: %O', clientCode)
            return clientCode;
        },
        // set alias module name
        resolveId(id) {
            return id.startsWith(MODULE_VIRTUAL_ID) ? MODULE_REQUEST_ID : null;
        },
    };
}

export * from "./types";
export { generateRoutes };
export default pagesPlugin;
