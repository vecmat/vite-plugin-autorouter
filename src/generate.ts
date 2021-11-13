
import { parse } from "path";
import { stringifyRoutes } from "./stringify";
import { isDynamicRoute, isCatchAllRoute } from "./utils";
import { Route, ResolvedOptions, ResolvedPages, ResolvedPage } from "./types";


// 排序规则
// layout >  slash > strlen
export function rearrange(pages: ResolvedPages) {
    return (
        [...pages]
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .map(([_, value]) => value)
            .sort((a, b) => {
                if(a.layout && !b.layout) return 1;
                if(!a.layout && b.layout) return 1;
                
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
        if (node.name === parent){
            node.children = node.children || [];
            console.log(node.name ,"===",route)
            node.children.push(route);
        }else{
            if(node.children){
                insertRouter(node.children,parent,route)
            }
        }
    })
}

export function generateRoutes(pages: ResolvedPages, options: ResolvedOptions): Route[] {
    const { nuxtStyle } = options;

    const rooter: Route[] = [];
    // 先创建完全路由表
    const sortpages = rearrange(pages);

    sortpages.forEach((page: ResolvedPage) => {
        let { name, path, parent, component } = page;
        // 默认栈是根路由

        if (!parent) {
            const route: Route = {
                name: name,
                path: path,
                component,
            };
            rooter.push(route);
            return;
        }
        // ! 可能需要深度遍历
        // 多个 layout 则需要多次添加
        if (typeof parent === "string") {
            parent = [parent];
        }
        // chain
        // ! parent 应该使用链式标书  main.page.test
        parent.map((lay: string) => {
            const route: Route = {
                name: name,
                path: path,
                component,
            };
            console.log("===>",lay)
            insertRouter(rooter,lay,route)
        });
    });

    // // 移除额外数据
    // const preparedRoutes = prepareRoutes(rooter);

    // 路由排序
    let finalRoutes = rooter.sort((a, b) => {
        if (a.path.includes(":") && b.path.includes(":")) return b.path > a.path ? 1 : -1;
        else if (a.path.includes(":") || b.path.includes(":")) return a.path.includes(":") ? 1 : -1;
        else return b.path > a.path ? 1 : -1;
    });
    // 把catchAll 跳出来放最后
    // replace duplicated cache all route
    // todo (.*)* 结尾的放最后
    const allRoute = finalRoutes.find((i) => {
        return isCatchAllRoute(parse(i.component).name, nuxtStyle);
    });

    if (allRoute) {
        finalRoutes = finalRoutes.filter((i) => !isCatchAllRoute(parse(i.component).name, nuxtStyle));
        finalRoutes.push(allRoute);
    }
    console.log(JSON.stringify(finalRoutes,null,4));
    return finalRoutes;
}
