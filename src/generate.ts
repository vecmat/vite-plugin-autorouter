import { parse } from "path";
import { stringifyRoutes } from "./stringify";
import { isDynamicRoute, isCatchAllRoute } from "./utils";
import { Route, ResolvedOptions, ResolvedPages, ResolvedPage } from "./types";

export function generateClientCode(routes: Route[], options: ResolvedOptions) {
    const { imports, stringRoutes } = stringifyRoutes(routes, options);
    return `${imports.join(";\n")};\n\nconst routes = ${stringRoutes};\n\nexport default routes;`;
}


// 排序规则
// layout >  slash > strlen
export function sortPage(pages: ResolvedPages) {
    return (
        [...pages]
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .map(([_, value]) => value)
            .sort((a, b) => {
                if (a.parents && !b.parents) return 1;
                if (!a.parents && b.parents) return -1;
                let slasha = (a.path.match(/\//g) || []).length;
                let slashb = (b.path.match(/\//g) || []).length;
                if (slasha != slashb) {
                    return slasha - slashb;
                } else {
                    return a.path.length - b.path.length;
                }
            })
    );
}

// match > slash >strlen
export function sortRouter(stack: Route[]) {
    return stack
    .sort((a, b) => {
        let matcha  = a.path.replace(/[^\:\/]/g,"").indexOf(":") 
        matcha=matcha<0?999:matcha;
        let matchb  = b.path.replace(/[^\:\/]/g,"").indexOf(":")
        matchb=matchb<0?999:matchb;
        let slasha = (a.path.match(/\//g) || []).length;
        let slashb = (b.path.match(/\//g) || []).length;
        if(matcha != matchb){
            return matchb - matcha ;
        }else{
            if (slasha != slashb) {
                return slasha - slashb;
            } else {
                return a.path.length - b.path.length;
            }
        }
    })
}


function insertRouter(stack: Route[], parent: string, route: Route):boolean {
    // todo duplicate check ？
    // insert to root
    let inserted = false;
    if (!parent) {
        route.path = "$" + route.path;
        route.chain = "$" + route.chain;
        stack.push(route);
        return true;
    }
    // insert children router
    for(let node of stack){
        // console.log(node.chain,">>>",parent)
        if (node.chain?.endsWith(parent)) {
            inserted = true;
            route.name = node.name +"-"+  route.name;
            route.chain = node.chain +  route.path;
            node.children = node.children || [];
            node.children.push(route);
        }
        if (node.children) {
            if(insertRouter(node.children, parent, route)){
                inserted = true;
            }
        }
    };
    return inserted;
}


function prepareRoutes(stack: Route[], options: ResolvedOptions, root?: boolean) {
    let repeat = new Set();
    for (let node of stack) {
        if (repeat.has(node.path)) {
            throw new Error(`[vite-plugin-auturouter] duplicate route for ${node.component}`);
        }
        repeat.add(node.path);
        delete node.chain;
        if (root) {
            node.path = node.path.replace(/^\$/, "");
        } else {
            node.path = node.path.replace(/^\//, "");
        }
        if (!options.react) {
            node.props = true;
        } else {
            node.routes = node.children;
            delete node.children;
            node.exact = true;
            delete node.name;
        }
        if (node.children) {
            // delete node.name;
            node.children = prepareRoutes(node.children, options);
        }
        Object.assign(node, options.extendRoute?.(node) || {});
    }
    return  sortRouter(stack);
}

export function generateRoutes(pages: ResolvedPages, options: ResolvedOptions): Route[] {
    const { nuxtStyle } = options;

    let stack: Route[] = [];
    const sortpages = sortPage(pages);
    // console.log(sortpages)
    sortpages.forEach((page: ResolvedPage) => {
        let { name, path, parents, component } = page;
        if (typeof parents === "string") {
            parents = [parents];
        }
        parents.map((parent: string) => {
            const route: Route = {
                path: path,
                name: name,
                chain: parent+path,
                component,
            };
            let inserted = insertRouter(stack, parent, route);
            // 深度目录直接创建多层级路由
            // insert for depth router
            if (!inserted) {
                path = path.replace(/^([^/$])/,"/$1");
                parent =  parent.replace(/^\$/,"");
                parent =  parent.replace(/^([^/$])/,"/$1");
                route.path = parent+path
                route.path = "$" +  parent+path,
                stack.push(route);
            }
        });
    });
    // console.log(JSON.stringify(stack, null, 4));
    const finalRoutes = prepareRoutes(stack, options, true);
    // console.log(JSON.stringify(finalRoutes, null, 4));
    return finalRoutes;
}

