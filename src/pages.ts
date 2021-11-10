import { join, extname, resolve } from "path";
import {  ResolvedOptions, ResolvedPages, ResolvedPage } from "./types";
import { getPageFiles } from "./files";
import { getRouteBlock, routeBlockCache, toArray, slash } from "./utils";

export function removePage(pages: ResolvedPages, file: string) {
    pages.delete(file);
}

export function updatePage(pages: ResolvedPages, file: string) {
    const page = pages.get(file);
    if (page) {
        const customBlock = routeBlockCache.get(file) || null;
        page.customBlock = customBlock;
        pages.set(file, page);
    }
}

export async function addPage(pages: ResolvedPages, file: string, options: ResolvedOptions) {
    file = file.replace(options.root, "");
    const pageDir = options.pagesDir.find((i) => file.startsWith(`/${i}`));
    if (!pageDir) return;

    await setPage(pages, pageDir, file.replace(`/${pageDir}/`, ""), options);
}

export async function resolvePages(options: ResolvedOptions) {
    const dirs = toArray(options.pagesDir);
    console.log(dirs)
    const pages = new Map<string, ResolvedPage>();

    const pageDirFiles = dirs.map((dir) => {
        const pagePath = slash(resolve(options.root, dir));
        return {
            dir:dir,
            files: getPageFiles(pagePath, options),
        };
    });

    for (const row of pageDirFiles) {
        for (const file of row.files) 
            await setPage(pages, row.dir, file, options);
    }

    const routes: string[] = [];
    // 过滤路由
    for (const page of pages.values()) {
        if (!routes.includes(page.route)) 
            routes.push(page.route);
        else {
            console.log(routes)
            console.log(page.route)
            throw new Error(`[vite-plugin-autorouter] duplicate route in ${page.filepath}`);
        }
    }
    return pages;
}

async function setPage(pages: ResolvedPages, dist: string, file: string, options: ResolvedOptions) {
    const component = slash(join(dist, file));
    const filepath = slash(resolve(options.root, component));
    const extension = extname(file).slice(1);
    // 解析数据
    const customBlock = ["vue", "md"].includes(extension) ? await getRouteBlock(filepath, options) : null;
    const base = customBlock?.base  || "";
    const route =  customBlock?.path ||  file.replace(options.extensionsRE, "")
    // 保存变量
    pages.set(filepath, {
        file:file,
        base:base,
        dir: dist,
        route: route,
        extension,
        filepath,
        component,
        customBlock,
    });
}

// 根据 '/' 数量排序
// todo 根据 sort 排序， 
// 正则匹配优先级更高
// layout 优先级更好
// 未考虑正则问题！
function countSlash(value: string) {
    return (value.match(/\//g) || []).length;
}


export function sortPages(pages: ResolvedPages) {
    return (
        [...pages]
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .map(([_, value]) => value)
            .sort((a, b) => {
                return countSlash(a.route) - countSlash(b.route);
            })
    );
}
