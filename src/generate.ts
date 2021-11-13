/**
 * https://github.com/brattonross/vite-plugin-voie/blob/main/packages/vite-plugin-voie/src/routes.ts
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file at
 * https://github.com/brattonross/vite-plugin-voie/blob/main/LICENSE
 */

import { parse } from "path";
import { stringifyRoutes } from "./stringify";
import { isDynamicRoute, isCatchAllRoute } from "./utils";
import { Route, ResolvedOptions, ResolvedPages } from "./types";


function countSlash(value: string) {
    return (value.match(/\//g) || []).length;
}

// "/" 越少排在前面，多的排后面
// 根据 '/' 数量排序
// todo 根据 sort 排序， 
// 正则匹配优先级更高
// layout 优先级更好
// 未考虑正则问题！
export function sortBySlash(pages: ResolvedPages) {
    return (
        [...pages]
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .map(([_, value]) => value)
            .sort((a, b) => {
                let slasha =  countSlash(a.path) ;
                let slashb =  countSlash(b.path) ;
                if(slasha!= slashb){
                    return  countSlash(a.path) - countSlash(b.path);
                }else {
                    return  a.path.length - b.path.length
                }
            })
    );
}

export function generateClientCode(routes: Route[], options: ResolvedOptions) {
    const { imports, stringRoutes } = stringifyRoutes(routes, options);
    return `${imports.join(";\n")};\n\nconst routes = ${stringRoutes};\n\nexport default routes;`;
}

// 最终格式化处理
function prepareRoutes(routes: Route[], options: ResolvedOptions, parent?: Route) {
    for (const route of routes) {
        route.name = route.name || ""
        route.name = route.name.replace(/-index$/, "");

        route.path = route.path || "/"
        // route.path = route.path.replace(/^\/\//, "/");
        if (!options.react) 
            route.props = true;
        if (options.react) {
            delete route.name;
            route.routes = route.children;
            delete route.children;
            route.exact = true;
        }
        if (route.children) {
            delete route.name; // ! ? 
            route.children = prepareRoutes(route.children, options, route);
        }
      
        // delete route.customBlock?.name
        // if (!options.react) {
        //     Object.assign(route, route.customBlock || {});
        // }
        // extend route handle
        Object.assign(route, options.extendRoute?.(route, parent) || {});
      
    }
    return routes;
}



export function generateRoutes(pages: ResolvedPages, options: ResolvedOptions): Route[] {
    const { nuxtStyle } = options;

    const routes: Route[] = [];
    // 先构建layout
    // 配置可省略，则layout可指定children目录
    const sortpages = sortBySlash(pages)
    sortpages.forEach((page) => {
        const {name,path,customBlock } = page
        const stratum = page.path.replace(/^\//,"").split("/");
        // add leading slash to component path if not already there
        const component = page.component.replace(/^([^\/])/,"/$1")

        const route: Route = {
            name: name,
            path: "",
            component,
        };

        let parentRoutes = routes;
        for (let i = 0; i < stratum.length; i++) {
            const node = stratum[i];
            if(node ===""){
                
                continue
            }
            const isDynamic = isDynamicRoute(node, nuxtStyle);
            const isCatchAll = isCatchAllRoute(node, nuxtStyle);
           
            const normalizedName = isDynamic? 
                nuxtStyle?
                    isCatchAll
                        ? "all"
                        : node.replace(/^_/, "")
                    : node.replace(/^\[(\.{3})?/, "ALL").replace(/\]$/, "")
                : node;
            
            
            const normalizedPath = normalizedName.toLowerCase();
            route.path = normalizedPath
            // todo 通过配置
            // 路径相同默认为子路由
            // 不应该通过name识别，重名如何解决？
            const parent = parentRoutes.find((node) => {
                return  route.path.startsWith(node.path )
            });
           
            if (parent) {
                parent.children = parent.children || [];
                parentRoutes = parent.children;
                route.path = "/";
            } else if (normalizedName.toLowerCase() === "index" && !route.path) {
                route.path += "/";
            } else if (normalizedName.toLowerCase() !== "index") {
                if (isDynamic) {
                    if (isCatchAll) {
                        route.path += "/:captured(.*)*";
                    }else{
                        route.path += `/${normalizedName}`;
                    }
                } else {

                    route.path += `/${normalizedPath}`;
                }
            }
           
        }
        parentRoutes.push(route);
    });
    const preparedRoutes = prepareRoutes(routes, options);
   
  
    // 路由排序（正则）
    let finalRoutes = preparedRoutes.sort((a, b) => {
        if (a.path.includes(":") && b.path.includes(":")) return b.path > a.path ? 1 : -1;
        else if (a.path.includes(":") || b.path.includes(":")) return a.path.includes(":") ? 1 : -1;
        else return b.path > a.path ? 1 : -1;
    });

    // 把catchAll 跳出来放最后
    // replace duplicated cache all route
    const allRoute = finalRoutes.find((i) => {
        return isCatchAllRoute(parse(i.component).name, nuxtStyle);
    });
    if (allRoute) {
        finalRoutes = finalRoutes.filter((i) => !isCatchAllRoute(parse(i.component).name, nuxtStyle));
        finalRoutes.push(allRoute);
    }
    console.log(finalRoutes)
    return finalRoutes;
}
