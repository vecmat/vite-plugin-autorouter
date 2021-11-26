import { getPageFiles } from "./files";
import { join, extname, resolve ,basename,dirname} from "path";
import {  ResolvedOptions, ResolvedPages, ResolvedPage } from "./types";
import { getRouteBlock, routeBlockCache, toArray, slash } from "./utils";

// 匹配替换
// var path = "/_/_name/pre_name/[...]/asdf[id]/sss[...]/[...]"
function matchFormat(path:string){
    
    // "/aaa/_/ddd" => "/aaa/:/ddd"
    // "/aaa/_any/ddd" => "/aaa/:/ddd"
    path = path.replace(/_([^\[\]\\\/]*)/g,":$1")
    // "/aaa/[...]/ddd" => "/aaa/:/ddd"
    // "/aaa/bbb[...any]/ddd" => "/aaa/bbb:/ddd"
    path = path.replace(/(\[(\.\.\.)?([^\]\/]*)\])/g,":$3")
    // "/aaa/[any]/ddd" => "/aaa/:/ddd"
    // "/aaa/bbb[any]/ddd" => "/aaa/bbb:/ddd"
    path = path.replace(/(\[([^\[\]]+)\])/g,":$2")
    // /:/sss:/   ====>  /:any(.*)*/sss:any/
    path = path.replace(/(^|\/)(\:)(\/|$)/g,"$1:any*$3")
    path = path.replace(/(^|\/)([^\]\/]*)?(\:)(\/|$)/g,"$1$2:any$4")
    return path ;
}


async function setPage(pages: ResolvedPages, dir:string, file: string, options: ResolvedOptions) {
    file = slash(file)
    let extension = extname(file).slice(1);
    let parents = dirname(file).replace(dir,"")
    let filepath = slash(resolve(options.root, file));
    let filename = basename(file).replace(options.extensionsRE, "");
    filename =  matchFormat(filename)
    parents =  matchFormat(parents)
    let page : ResolvedPage = { 
        path:`/${filename}` , 
        parents : `${parents}`,
        component : `/${file}`,
     } ;
    let block : Record<string, any> =  {};
    if(["vue", "md"].includes(extension)){
        block = await getRouteBlock(filepath, options)
    }

    Object.assign(page,block)
    page.path =  page.path.replace(/^([^/$])/,"/$1");
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
    if(file === "UNMATCHED"){
        console.log(options.root)
    }
}

export function removePage(pages: ResolvedPages, file: string) {
    pages.delete(file);
}

