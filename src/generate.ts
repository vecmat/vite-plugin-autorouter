
import { parse } from "path";
import { stringifyRoutes } from "./stringify";
import { isDynamicRoute, isCatchAllRoute } from "./utils";
import { Route, ResolvedOptions, ResolvedPages, ResolvedPage } from "./types";
import { debug } from "./utils";

// 排序规则
// layout >  slash > strlen
export function rearrange(pages: ResolvedPages) {
    return (
        [...pages]
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .map(([_, value]) => value)
            .sort((a, b) => {
                if(a.layout && !b.layout) return 1;
                if(!a.layout && b.layout) return -1;
                let slasha = (a.path.match(/\//g) || []).length;
                let slashb =(b.path.match(/\//g) || []).length;
                if (slasha != slashb) {
                    return slasha - slashb;
                } else {
                    return a.path.length - b.path.length;
                }
            })
    );
}

export function generateClientCode(routes: Route[], options: ResolvedOptions) {
    const { imports, stringRoutes } = stringifyRoutes(routes, options);
    return `${imports.join(";\n")};\n\nconst routes = ${stringRoutes};\n\nexport default routes;`;
}


function insertRouter(stack: Route[],parent:string,route:Route){
    stack.map((node)=>{
        if (node.chain === parent){
            node.children = node.children || [];
            node.children.push(route);
        }
        if(node.children){
            insertRouter(node.children,parent,route)
        }
    })
}

function prepareRoutes(stack: Route[], options: ResolvedOptions){
    let repeat = new Set();
    for(let node of stack) {
        if(repeat.has(node.path)){
            throw new Error(`[vite-plugin-pages] duplicate route for ${node.component}`)
        }
        repeat.add(node.path)
        Object.assign(node, options.extendRoute?.(node) || {})
        delete node.chain;
        if (!options.react){
            node.props = true;
        } else {
            delete node.name
            node.routes = node.children
            delete node.children
            node.exact = true
        }
        if(node.children){
            delete node.name
            node.children =  prepareRoutes(node.children,options)
        }
    }
    return stack
}

export function generateRoutes(pages: ResolvedPages, options: ResolvedOptions): Route[] {
    const { nuxtStyle } = options;

    const rooter: Route[] = [];
    // 先创建完全路由表
    const sortpages = rearrange(pages);

    sortpages.forEach((page: ResolvedPage) => {
        let { name, path, parents, component } = page;
        // "" || null
        if (!parents) {
            const route: Route = {
                name: name,
                path: path,
                chain:name,
                component,
            };
            
            rooter.push(route);
            return;
        }
        // 多个 layout 则需要多次添加
        if (typeof parents === "string") {
            parents = [parents];
        }
        path = path.replace(/^\//,"")
        parents.map((parent: string) => {
            const route: Route = {
                name: name,
                path: path,
                chain:parent+"."+name,
                component,
            };
            insertRouter(rooter,parent,route)
        });
    });


    const preparedRoutes = prepareRoutes(rooter,options);
    let finalRoutes = preparedRoutes.sort((a, b) => {
        if (a.path.includes(":") && b.path.includes(":")) return b.path > a.path ? 1 : -1;
        else if (a.path.includes(":") || b.path.includes(":")) return a.path.includes(":") ? 1 : -1;
        else return b.path > a.path ? 1 : -1;
    });
    // 把catchAll 跳出来放最后
    // todo (.*)* 结尾的放最后
    const allRoute = finalRoutes.find((i) => {
        return isCatchAllRoute(parse(i.component).name, nuxtStyle);
    });

    if (allRoute) {
        finalRoutes = finalRoutes.filter((i) => !isCatchAllRoute(parse(i.component).name, nuxtStyle));
        finalRoutes.push(allRoute);
    }
    // console.log(JSON.stringify(finalRoutes,null,4));
    return finalRoutes;
}
