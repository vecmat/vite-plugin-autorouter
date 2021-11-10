import { resolve } from "path";
import { UserOptions, ResolvedOptions } from "./types";
import { getPageDirs } from "./files";
import { toArray, slash } from "./utils";

function resolvePageDirs(pagesDir: string[], root: string, exclude: string[]) {
    pagesDir = toArray(pagesDir);
    return pagesDir.flatMap((pagesDir) => {
        pagesDir = slash(resolve(root, pagesDir)).replace(`${root}/`, "");
        return getPageDirs(pagesDir, root, exclude);
    });
}

export function resolveOptions(userOptions: UserOptions, viteRoot?: string): ResolvedOptions {
    const {
        pagesDir = ["src/pages"],
        routeBlockLang = "json5",
        exclude = [],
        syncIndex = true,
        replaceSquareBrackets = false,
        nuxtStyle = false,
        react = false,
        extendRoute,
        onRoutesGenerated,
        onClientGenerated,
    } = userOptions;

    const root = viteRoot || slash(process.cwd());

    const importMode = userOptions.importMode || (react ? "sync" : "async");

    const extensions = userOptions.extensions || (react ? ["tsx", "jsx"] : ["vue", "ts", "js"]);

    const extensionsRE = new RegExp(`\\.(${extensions.join("|")})$`);

    const resolvedPagesDir = resolvePageDirs(pagesDir, root, exclude);

    const resolvedOptions: ResolvedOptions = {
        pagesDir: resolvedPagesDir,
        root,
        react,
        exclude,
        syncIndex,
        nuxtStyle,
        extensions,
        importMode,
        extensionsRE,
        routeBlockLang,
        replaceSquareBrackets,
        extendRoute,
        onRoutesGenerated,
        onClientGenerated,
    };

    return resolvedOptions;
}
