export type ImportMode = "sync" | "async";
export type ImportModeResolveFn = (filepath: string) => ImportMode;


export interface ResolvedPage extends Record<string, any> {
    name?: string;
    path: string;
    component: string;
}
export type ResolvedPages = Map<string, ResolvedPage>;


export interface Route {
    // custom
    chain?: string;
    paths?: string[];

    // basic
    path: string;
    name?: string;
    alias?: string|string[];
    props?: boolean | Record<string, any> | ((to: any) => Record<string, any>);
    component: string;
    exact?: boolean;
    routes?: Route[];
    beforeEnter?: any;
    children?: Route[];
    meta?: Record<string, unknown>;
}


export interface ResolvedOptions extends Options {
    root: string;
    pagesDir: string[];
    extensionsRE: RegExp;
}


/**
 * Plugin options.
 */
 interface Options {
    /**
     * Relative path to the directory to search for page components.
     * @default 'src/pages'
     */
    pagesDir: string[];
    /**
     * Valid file extensions for page components.
     * @default ['vue', 'js']
     */
    extensions: string[];
    /**
     * List of path globs to exclude when resolving pages.
     */
    exclude: string[];
    /**
     * Import routes directly or as async components
     * @default 'async'
     */
    importMode: ImportMode | ImportModeResolveFn;
    /**
     * Sync load top level index file
     * @default true
     */
    syncIndex: boolean;
    /**
     * Use Nuxt.js style dynamic routing
     * @default false
     */
    nuxtStyle: boolean;
    /**
     * Set default route block parser, or use `<route lang=xxx>` in SFC route block
     * @default 'json5'
     */
    routeBlockLang: "json5" | "json" | "yaml" | "yml" | "toml";
    /**
     * Replace '[]' to '_' in bundle chunk filename
     * Experimental feature
     * @default true
     */
    replaceSquareBrackets: boolean;
    /**
     * Generate React Route
     * @default false
     */
    react: boolean;
    /**
     * Extend route records
     */
    extendRoute?: (route: Route) => Route | void;
    /**
     * Custom generated routes
     */
    onRoutesGenerated?: (routes: Route[]) => Route[] | void | Promise<Route[] | void>;
    /**
     * Custom generated client code
     */
    onClientGenerated?: (clientCode: string) => string | void | Promise<string | void>;
}

export type UserOptions = Partial<Options>;
