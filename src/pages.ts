import { getPageFiles } from "./files";
import { join, extname, resolve ,basename,dirname} from "path";
import {  ResolvedOptions, ResolvedPages, ResolvedPage } from "./types";
import { getRouteBlock, routeBlockCache, toArray, slash } from "./utils";

// 只负责生成一个MAP对象

async function setPage(pages: ResolvedPages, dir:string, file: string, options: ResolvedOptions) {
    const extension = extname(file).slice(1);
    const filepath = slash(resolve(options.root, file));
    const filename = basename(file).replace(options.extensionsRE, "");
    const parents = dirname(file).replace(dir,"").replace(/^\//,"").replace(/\//g,".")
    let page : ResolvedPage = { 
        name:`${filename}` ,
        path:`/${filename}` , 
        parents : `${parents}`,
        component : `/${file}`,
     } ;
    let block : Record<string, any> =  {};
    if(["vue", "md"].includes(extension)){
        block = await getRouteBlock(filepath, options)
    }
    Object.assign(page,block)
    block.path =  block.path.replace(/^(^\/)/,"/$1")
    pages.set(file,page);
}

export async function resolvePages(options: ResolvedOptions) {
    const dirs = toArray(options.pagesDir);
    const pages = new Map<string, ResolvedPage>();

    const pageDirFiles = dirs.map((dir) => {
        const pagePath = slash(resolve(options.root, dir));
        return {
            dir:dir,
            files: getPageFiles(pagePath, options),
        };
    });
    for (const row of pageDirFiles) {
        for (const file of row.files) {
            await setPage(pages,row.dir, join(row.dir , file), options);
        }

    }
    return pages;
}

export async function addPage(pages: ResolvedPages, file: string, options: ResolvedOptions) {
    file = file.replace(options.root, "");
    const pageDir = options.pagesDir.find((i) => {
        file.startsWith(`/${i}`)
    });
    if (!pageDir) return;
    await setPage(pages,pageDir , file ,options);
}

export async function updatePage(pages: ResolvedPages, file: string , options: ResolvedOptions ) {
    const page = pages.get(file);
    if (page) {
        const customBlock = routeBlockCache.get(file) || null;
        page.customBlock = customBlock;
        pages.set(file, page);
        
    }
}

export function removePage(pages: ResolvedPages, file: string) {
    pages.delete(file);
}

