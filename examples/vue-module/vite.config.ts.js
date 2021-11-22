var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw new Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __reExport = (target, module, desc) => {
  if (module && typeof module === "object" || typeof module === "function") {
    for (let key of __getOwnPropNames(module))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module) => {
  return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
};

// ../../dist/index.js
var require_dist = __commonJS({
  "../../dist/index.js"(exports) {
    var __create2 = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __getProtoOf2 = Object.getPrototypeOf;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __markAsModule2 = (target) => __defProp2(target, "__esModule", { value: true });
    var __export = (target, all) => {
      __markAsModule2(target);
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __reExport2 = (target, module2, desc) => {
      if (module2 && typeof module2 === "object" || typeof module2 === "function") {
        for (let key of __getOwnPropNames2(module2))
          if (!__hasOwnProp2.call(target, key) && key !== "default")
            __defProp2(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc2(module2, key)) || desc.enumerable });
      }
      return target;
    };
    var __toModule2 = (module2) => {
      return __reExport2(__markAsModule2(__defProp2(module2 != null ? __create2(__getProtoOf2(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
    };
    __export(exports, {
      default: () => src_default,
      generateRoutes: () => generateRoutes
    });
    var import_fs = __toModule2(__require("fs"));
    var import_path2 = __toModule2(__require("path"));
    var import_debug = __toModule2(__require("debug"));
    var import_deep_equal = __toModule2(__require("deep-equal"));
    var import_utils = __toModule2(__require("@antfu/utils"));
    var import_json5 = __toModule2(__require("json5"));
    var import_yaml = __toModule2(__require("yaml"));
    var import_toml = __toModule2(__require("toml"));
    async function parseSFC(code) {
      try {
        const { parse } = await Promise.resolve().then(() => __toModule2(__require("@vue/compiler-sfc")));
        return parse(code, {
          pad: "space"
        }).descriptor;
      } catch (e) {
        throw new Error("[vite-plugin-autorouter] Vue3's '@vue/compiler-sfc' is required.");
      }
    }
    function parseCustomBlock(block, filePath, options) {
      var _a;
      const lang = (_a = block.lang) != null ? _a : options.routeBlockLang;
      if (lang === "json5") {
        try {
          return import_json5.default.parse(block.content);
        } catch (err) {
          throw new Error(`Invalid JSON5 format of <${block.type}> content in ${filePath}
${err.message}`);
        }
      } else if (lang === "json") {
        try {
          return JSON.parse(block.content);
        } catch (err) {
          throw new Error(`Invalid JSON format of <${block.type}> content in ${filePath}
${err.message}`);
        }
      } else if (lang === "toml") {
        try {
          return import_toml.default.parse(block.content);
        } catch (err) {
          throw new Error(`Invalid TOML format of <${block.type}> content in ${filePath}
${err.message}`);
        }
      } else if (lang === "yaml" || lang === "yml") {
        try {
          return import_yaml.default.parse(block.content);
        } catch (err) {
          throw new Error(`Invalid YAML format of <${block.type}> content in ${filePath}
${err.message}`);
        }
      }
    }
    var MODULE_VIRTUAL_ID = "virtual:autorouter";
    var MODULE_REQUEST_ID = "/@vite-plugin-autorouter/generated-pages";
    var routeBlockCache = new Map();
    function extensionsToGlob(extensions) {
      return extensions.length > 1 ? `{${extensions.join(",")}}` : extensions[0] || "";
    }
    function isPagesDir(path, options) {
      for (const page of options.pagesDir) {
        const dirPath = (0, import_utils.slash)((0, import_path2.resolve)(options.root, page));
        if (path.startsWith(dirPath))
          return true;
      }
      return false;
    }
    function isTarget(path, options) {
      return isPagesDir(path, options) && options.extensionsRE.test(path);
    }
    var debug = {
      hmr: (0, import_debug.default)("vite-plugin-autorouter:hmr"),
      parser: (0, import_debug.default)("vite-plugin-autorouter:parser"),
      gen: (0, import_debug.default)("vite-plugin-autorouter:gen"),
      options: (0, import_debug.default)("vite-plugin-autorouter:options"),
      cache: (0, import_debug.default)("vite-plugin-autorouter:cache"),
      pages: (0, import_debug.default)("vite-plugin-autorouter:pages")
    };
    function resolveImportMode(filepath, options) {
      const mode = options.importMode;
      if (typeof mode === "function")
        return mode(filepath);
      for (const pageDir of options.pagesDir) {
        if (options.syncIndex && pageDir === "" && filepath === `/${pageDir}/index.vue`)
          return "sync";
      }
      return mode;
    }
    function pathToName(filepath) {
      return filepath.replace(/[_.\-\\/]/g, "_").replace(/[[:\]()]/g, "$");
    }
    async function getRouteBlock(path, options) {
      const content = import_fs.default.readFileSync(path, "utf8");
      const parsed = await parseSFC(content);
      const blockStr = parsed.customBlocks.find((b) => b.type === "route");
      if (!blockStr)
        return {};
      const result = parseCustomBlock(blockStr, path, options);
      debug.parser("%s: %O", path, result);
      routeBlockCache.set((0, import_utils.slash)(path), result);
      return result;
    }
    function getPagesVirtualModule(server) {
      const { moduleGraph } = server;
      const module2 = moduleGraph.getModuleById(MODULE_REQUEST_ID);
      if (module2) {
        moduleGraph.invalidateModule(module2);
        return module2;
      }
      return null;
    }
    function replaceSquareBrackets(bundle) {
      const files = Object.keys(bundle).map((i) => (0, import_path2.basename)(i));
      for (const chunk of Object.values(bundle)) {
        chunk.fileName = chunk.fileName.replace(/(\[|\])/g, "_");
        if (chunk.type === "chunk") {
          for (const file of files)
            chunk.code = chunk.code.replace(file, file.replace(/(\[|\])/g, "_"));
        }
      }
    }
    async function isRouteBlockChanged(filePath, options) {
      debug.cache(routeBlockCache);
      const oldRouteBlock = routeBlockCache.get(filePath);
      const routeBlock = await getRouteBlock(filePath, options);
      debug.hmr("%s old: %O", filePath, oldRouteBlock);
      debug.hmr("%s new: %O", filePath, routeBlock);
      return !(0, import_deep_equal.default)(oldRouteBlock, routeBlock);
    }
    var componentRE = /"component":("(.*?)")/g;
    var hasFunctionRE = /"(?:props|beforeEnter)":("(.*?)")/g;
    var singlelineCommentsRE = /\/\/.*/g;
    var multilineCommentsRE = /\/\*(.|[\r\n])*?\*\//gm;
    function replaceFunction(_, value) {
      if (value instanceof Function || typeof value === "function") {
        const fnBody = value.toString().replace(multilineCommentsRE, "").replace(singlelineCommentsRE, "").replace(/(\t|\n|\r|\s)/g, "");
        if (fnBody.length < 8 || fnBody.substring(0, 8) !== "function")
          return `_NuFrRa_${fnBody}`;
        return fnBody;
      }
      return value;
    }
    function stringifyRoutes(preparedRoutes, options) {
      const imports = [];
      function componentReplacer(str, replaceStr, path) {
        const mode = resolveImportMode(path, options);
        if (mode === "sync") {
          const importName = pathToName(path);
          const importStr = `import ${importName} from '${path}'`;
          if (!imports.includes(importStr))
            imports.push(importStr);
          return str.replace(replaceStr, importName);
        } else {
          return str.replace(replaceStr, `() => import('${path}')`);
        }
      }
      function functionReplacer(str, replaceStr, content) {
        if (content.startsWith("function"))
          return str.replace(replaceStr, content);
        if (content.startsWith("_NuFrRa_"))
          return str.replace(replaceStr, content.slice(8));
        return str;
      }
      const stringRoutes = JSON.stringify(preparedRoutes, replaceFunction).replace(componentRE, componentReplacer).replace(hasFunctionRE, functionReplacer);
      return {
        imports,
        stringRoutes
      };
    }
    function generateClientCode(routes, options) {
      const { imports, stringRoutes } = stringifyRoutes(routes, options);
      return `${imports.join(";\n")};

const routes = ${stringRoutes};

export default routes;`;
    }
    function sortPage(pages) {
      return [...pages].map(([_, value]) => value).sort((a, b) => {
        if (a.parents && !b.parents)
          return 1;
        if (!a.parents && b.parents)
          return -1;
        let slasha = (a.path.match(/\//g) || []).length;
        let slashb = (b.path.match(/\//g) || []).length;
        if (slasha != slashb) {
          return slasha - slashb;
        } else {
          return a.path.length - b.path.length;
        }
      });
    }
    function sortRouter(stack) {
      return stack.sort((a, b) => {
        let matcha = a.path.replace(/[^\:\/]/g, "").indexOf(":");
        matcha = matcha < 0 ? 999 : matcha;
        let matchb = b.path.replace(/[^\:\/]/g, "").indexOf(":");
        matchb = matchb < 0 ? 999 : matchb;
        let slasha = (a.path.match(/\//g) || []).length;
        let slashb = (b.path.match(/\//g) || []).length;
        if (matcha != matchb) {
          return matchb - matcha;
        } else {
          if (slasha != slashb) {
            return slasha - slashb;
          } else {
            return a.path.length - b.path.length;
          }
        }
      });
    }
    function insertRouter(stack, parent, route) {
      var _a;
      let inserted = false;
      if (!parent) {
        route.path = "$" + route.path;
        route.chain = "$" + route.chain;
        stack.push(route);
        return true;
      }
      for (let node of stack) {
        if ((_a = node.chain) == null ? void 0 : _a.endsWith(parent)) {
          inserted = true;
          route.chain = node.chain + route.path;
          node.children = node.children || [];
          node.children.push(route);
        }
        if (node.children) {
          if (insertRouter(node.children, parent, route)) {
            inserted = true;
          }
        }
      }
      ;
      return inserted;
    }
    function prepareRoutes(stack, options, root) {
      var _a;
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
          node.children = prepareRoutes(node.children, options);
        }
        Object.assign(node, ((_a = options.extendRoute) == null ? void 0 : _a.call(options, node)) || {});
      }
      return sortRouter(stack);
    }
    function generateRoutes(pages, options) {
      const { nuxtStyle } = options;
      let stack = [];
      const sortpages = sortPage(pages);
      sortpages.forEach((page) => {
        let { name, path, parents, component } = page;
        if (typeof parents === "string") {
          parents = [parents];
        }
        parents.map((parent) => {
          const route = {
            path,
            name,
            chain: parent + path,
            component
          };
          Object.assign(route, page);
          let inserted = insertRouter(stack, parent, route);
          if (!inserted) {
            path = path.replace(/^([^/$])/, "/$1");
            parent = parent.replace(/^\$/, "");
            parent = parent.replace(/^([^/$])/, "/$1");
            route.path = parent + path;
            route.path = "$" + parent + path, stack.push(route);
          }
        });
      });
      const finalRoutes = prepareRoutes(stack, options, true);
      return finalRoutes;
    }
    var import_path22 = __toModule2(__require("path"));
    var import_fast_glob = __toModule2(__require("fast-glob"));
    function getIgnore(exclude) {
      return ["node_modules", ".git", "**/__*__/**", ...exclude];
    }
    function getPageDirs(pageDirOptions, root, exclude) {
      const dirs = import_fast_glob.default.sync(pageDirOptions, {
        ignore: getIgnore(exclude),
        onlyDirectories: true,
        dot: true,
        unique: true,
        cwd: root
      });
      return dirs;
    }
    function getPageFiles(path, options) {
      const { exclude, extensions } = options;
      const ext = extensionsToGlob(extensions);
      const files = import_fast_glob.default.sync(`**/*.${ext}`, {
        ignore: getIgnore(exclude),
        onlyFiles: true,
        cwd: path
      });
      return files;
    }
    function resolvePageDirs(pagesDir, root, exclude) {
      pagesDir = (0, import_utils.toArray)(pagesDir);
      return pagesDir.flatMap((pagesDir2) => {
        pagesDir2 = (0, import_utils.slash)((0, import_path22.resolve)(root, pagesDir2)).replace(`${root}/`, "");
        return getPageDirs(pagesDir2, root, exclude);
      });
    }
    function resolveOptions(userOptions, viteRoot) {
      const {
        pagesDir = ["src/pages"],
        routeBlockLang = "json5",
        exclude = [],
        syncIndex = true,
        replaceSquareBrackets: replaceSquareBrackets2 = false,
        nuxtStyle = false,
        react = false,
        extendRoute,
        onRoutesGenerated,
        onClientGenerated
      } = userOptions;
      const root = viteRoot || (0, import_utils.slash)(process.cwd());
      const importMode = userOptions.importMode || (react ? "sync" : "async");
      const extensions = userOptions.extensions || (react ? ["tsx", "jsx"] : ["vue", "ts", "js"]);
      const extensionsRE = new RegExp(`\\.(${extensions.join("|")})$`);
      const resolvedPagesDir = resolvePageDirs(pagesDir, root, exclude);
      const resolvedOptions = {
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
        replaceSquareBrackets: replaceSquareBrackets2,
        extendRoute,
        onRoutesGenerated,
        onClientGenerated
      };
      return resolvedOptions;
    }
    var import_path3 = __toModule2(__require("path"));
    function matchFormat(path) {
      path = path.replace(/_([^\[\]\\\/]*)/g, ":$1");
      path = path.replace(/(\[(\.\.\.)?([^\]\/]*)\])/g, ":$3");
      path = path.replace(/(\[([^\[\]]+)\])/g, ":$2");
      path = path.replace(/(^|\/)(\:)(\/|$)/g, "$1:any*$3");
      path = path.replace(/(^|\/)([^\]\/]*)?(\:)(\/|$)/g, "$1$2:any$4");
      return path;
    }
    async function setPage(pages, dir, file, options) {
      let extension = (0, import_path3.extname)(file).slice(1);
      let parents = (0, import_path3.dirname)(file).replace(dir, "");
      let filepath = (0, import_utils.slash)((0, import_path3.resolve)(options.root, file));
      let filename = (0, import_path3.basename)(file).replace(options.extensionsRE, "");
      filename = matchFormat(filename);
      parents = matchFormat(parents);
      let page = {
        name: `${file}`,
        path: `/${filename}`,
        parents: `${parents}`,
        component: `/${file}`
      };
      let block = {};
      if (["vue", "md"].includes(extension)) {
        block = await getRouteBlock(filepath, options);
      }
      Object.assign(page, block);
      page.path = page.path.replace(/^([^/$])/, "/$1");
      pages.set(file, page);
    }
    async function resolvePages(options) {
      const dirs = (0, import_utils.toArray)(options.pagesDir);
      const pages = new Map();
      const pageDirFiles = dirs.map((dir) => {
        const pagePath = (0, import_utils.slash)((0, import_path3.resolve)(options.root, dir));
        return {
          dir,
          files: getPageFiles(pagePath, options)
        };
      });
      for (const row of pageDirFiles) {
        for (const file of row.files) {
          await setPage(pages, row.dir, (0, import_path3.join)(row.dir, file), options);
        }
      }
      return pages;
    }
    async function addPage(pages, file, options) {
      file = file.replace(options.root, "");
      const pageDir = options.pagesDir.find((i) => {
        file.startsWith(`/${i}`);
      });
      if (!pageDir)
        return;
      await setPage(pages, pageDir, file, options);
    }
    async function updatePage(pages, file, options) {
      const page = pages.get(file);
      if (page) {
        const customBlock = routeBlockCache.get(file) || null;
        page.customBlock = customBlock;
        pages.set(file, page);
      }
      if (file === "UNMATCHED") {
        console.log(options.root);
      }
    }
    function removePage(pages, file) {
      pages.delete(file);
    }
    function handleHMR(server, pages, options, clearRoutes) {
      const { ws, watcher } = server;
      function fullReload() {
        getPagesVirtualModule(server);
        clearRoutes();
        ws.send({
          type: "full-reload"
        });
      }
      watcher.on("add", async (path) => {
        if (/(vue.md)$/.test(path))
          return;
        const file = path.replace(options.root, "");
        if (isTarget(file, options)) {
          await addPage(pages, file, options);
          debug.hmr("add", file);
          fullReload();
        }
      });
      watcher.on("unlink", (path) => {
        if (/(vue.md)$/.test(path))
          return;
        const file = path.replace(options.root, "");
        if (isTarget(file, options)) {
          removePage(pages, file);
          debug.hmr("remove", file);
          fullReload();
        }
      });
      watcher.on("change", async (path) => {
        if (/(vue.md)$/.test(path))
          return;
        const file = path.replace(options.root, "");
        if (isTarget(file, options) && !options.react) {
          const needReload = await isRouteBlockChanged(file, options);
          if (needReload) {
            updatePage(pages, file, options);
            debug.hmr("change", file);
            fullReload();
          }
        }
      });
    }
    function pagesPlugin(userOptions = {}) {
      let generatedRoutes = null;
      let options;
      let pages;
      return {
        name: "vite-plugin-autorouter",
        enforce: "pre",
        async transform(_code, id) {
          if (!/vue&type=route/.test(id))
            return;
          return {
            code: "export default {};",
            map: null
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
          var _a, _b;
          if (id !== MODULE_REQUEST_ID)
            return;
          if (!generatedRoutes) {
            generatedRoutes = [];
            try {
              generatedRoutes = generateRoutes(pages, options);
            } catch (err) {
              console.error(err);
            }
            generatedRoutes = await ((_a = options.onRoutesGenerated) == null ? void 0 : _a.call(options, generatedRoutes)) || generatedRoutes;
          }
          debug.gen("routes: %O", generatedRoutes);
          let clientCode = generateClientCode(generatedRoutes, options);
          clientCode = await ((_b = options.onClientGenerated) == null ? void 0 : _b.call(options, clientCode)) || clientCode;
          debug.gen("client code: %O", clientCode);
          return clientCode;
        },
        resolveId(id) {
          return id.startsWith(MODULE_VIRTUAL_ID) ? MODULE_REQUEST_ID : null;
        }
      };
    }
    var src_default = pagesPlugin;
  }
});

// vite.config.ts
var import_dist = __toModule(require_dist());
import { resolve } from "path";
import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import Markdown from "vite-plugin-md";
var config = defineConfig({
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/]
    }),
    (0, import_dist.default)({
      pagesDir: [
        "src/admin/pages",
        "src/features/**/pages",
        resolve("/Users/hanrea/Work/OPEN/vite-plugin-autorouter/examples/vue-module", "./src/pages")
      ],
      extensions: ["vue", "md"],
      syncIndex: true,
      replaceSquareBrackets: true,
      extendRoute(route) {
        if (route.name === "about") {
          route.props = (route2) => ({
            query: route2.query.q
          });
        }
        if (route.name === "components") {
          return __spreadProps(__spreadValues({}, route), {
            beforeEnter: (route2) => {
              console.log(route2);
            }
          });
        }
      }
    }),
    Markdown()
  ]
});
var vite_config_default = config;
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vZGlzdC9pbmRleC5qcyIsICJ2aXRlLmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsidmFyIF9fY3JlYXRlID0gT2JqZWN0LmNyZWF0ZTtcbnZhciBfX2RlZlByb3AgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG52YXIgX19nZXRPd25Qcm9wRGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG52YXIgX19nZXRPd25Qcm9wTmFtZXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcztcbnZhciBfX2dldFByb3RvT2YgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG52YXIgX19oYXNPd25Qcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBfX21hcmtBc01vZHVsZSA9ICh0YXJnZXQpID0+IF9fZGVmUHJvcCh0YXJnZXQsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIF9fZXhwb3J0ID0gKHRhcmdldCwgYWxsKSA9PiB7XG4gIF9fbWFya0FzTW9kdWxlKHRhcmdldCk7XG4gIGZvciAodmFyIG5hbWUgaW4gYWxsKVxuICAgIF9fZGVmUHJvcCh0YXJnZXQsIG5hbWUsIHsgZ2V0OiBhbGxbbmFtZV0sIGVudW1lcmFibGU6IHRydWUgfSk7XG59O1xudmFyIF9fcmVFeHBvcnQgPSAodGFyZ2V0LCBtb2R1bGUyLCBkZXNjKSA9PiB7XG4gIGlmIChtb2R1bGUyICYmIHR5cGVvZiBtb2R1bGUyID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBtb2R1bGUyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBmb3IgKGxldCBrZXkgb2YgX19nZXRPd25Qcm9wTmFtZXMobW9kdWxlMikpXG4gICAgICBpZiAoIV9faGFzT3duUHJvcC5jYWxsKHRhcmdldCwga2V5KSAmJiBrZXkgIT09IFwiZGVmYXVsdFwiKVxuICAgICAgICBfX2RlZlByb3AodGFyZ2V0LCBrZXksIHsgZ2V0OiAoKSA9PiBtb2R1bGUyW2tleV0sIGVudW1lcmFibGU6ICEoZGVzYyA9IF9fZ2V0T3duUHJvcERlc2MobW9kdWxlMiwga2V5KSkgfHwgZGVzYy5lbnVtZXJhYmxlIH0pO1xuICB9XG4gIHJldHVybiB0YXJnZXQ7XG59O1xudmFyIF9fdG9Nb2R1bGUgPSAobW9kdWxlMikgPT4ge1xuICByZXR1cm4gX19yZUV4cG9ydChfX21hcmtBc01vZHVsZShfX2RlZlByb3AobW9kdWxlMiAhPSBudWxsID8gX19jcmVhdGUoX19nZXRQcm90b09mKG1vZHVsZTIpKSA6IHt9LCBcImRlZmF1bHRcIiwgbW9kdWxlMiAmJiBtb2R1bGUyLl9fZXNNb2R1bGUgJiYgXCJkZWZhdWx0XCIgaW4gbW9kdWxlMiA/IHsgZ2V0OiAoKSA9PiBtb2R1bGUyLmRlZmF1bHQsIGVudW1lcmFibGU6IHRydWUgfSA6IHsgdmFsdWU6IG1vZHVsZTIsIGVudW1lcmFibGU6IHRydWUgfSkpLCBtb2R1bGUyKTtcbn07XG5cbi8vIHNyYy9pbmRleC50c1xuX19leHBvcnQoZXhwb3J0cywge1xuICBkZWZhdWx0OiAoKSA9PiBzcmNfZGVmYXVsdCxcbiAgZ2VuZXJhdGVSb3V0ZXM6ICgpID0+IGdlbmVyYXRlUm91dGVzXG59KTtcblxuLy8gc3JjL3V0aWxzLnRzXG52YXIgaW1wb3J0X2ZzID0gX190b01vZHVsZShyZXF1aXJlKFwiZnNcIikpO1xudmFyIGltcG9ydF9wYXRoID0gX190b01vZHVsZShyZXF1aXJlKFwicGF0aFwiKSk7XG52YXIgaW1wb3J0X2RlYnVnID0gX190b01vZHVsZShyZXF1aXJlKFwiZGVidWdcIikpO1xudmFyIGltcG9ydF9kZWVwX2VxdWFsID0gX190b01vZHVsZShyZXF1aXJlKFwiZGVlcC1lcXVhbFwiKSk7XG52YXIgaW1wb3J0X3V0aWxzID0gX190b01vZHVsZShyZXF1aXJlKFwiQGFudGZ1L3V0aWxzXCIpKTtcblxuLy8gc3JjL3BhcnNlci50c1xudmFyIGltcG9ydF9qc29uNSA9IF9fdG9Nb2R1bGUocmVxdWlyZShcImpzb241XCIpKTtcbnZhciBpbXBvcnRfeWFtbCA9IF9fdG9Nb2R1bGUocmVxdWlyZShcInlhbWxcIikpO1xudmFyIGltcG9ydF90b21sID0gX190b01vZHVsZShyZXF1aXJlKFwidG9tbFwiKSk7XG5hc3luYyBmdW5jdGlvbiBwYXJzZVNGQyhjb2RlKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBwYXJzZSB9ID0gYXdhaXQgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiBfX3RvTW9kdWxlKHJlcXVpcmUoXCJAdnVlL2NvbXBpbGVyLXNmY1wiKSkpO1xuICAgIHJldHVybiBwYXJzZShjb2RlLCB7XG4gICAgICBwYWQ6IFwic3BhY2VcIlxuICAgIH0pLmRlc2NyaXB0b3I7XG4gIH0gY2F0Y2gge1xuICAgIHRocm93IG5ldyBFcnJvcihcIlt2aXRlLXBsdWdpbi1hdXRvcm91dGVyXSBWdWUzJ3MgJ0B2dWUvY29tcGlsZXItc2ZjJyBpcyByZXF1aXJlZC5cIik7XG4gIH1cbn1cbmZ1bmN0aW9uIHBhcnNlQ3VzdG9tQmxvY2soYmxvY2ssIGZpbGVQYXRoLCBvcHRpb25zKSB7XG4gIHZhciBfYTtcbiAgY29uc3QgbGFuZyA9IChfYSA9IGJsb2NrLmxhbmcpICE9IG51bGwgPyBfYSA6IG9wdGlvbnMucm91dGVCbG9ja0xhbmc7XG4gIGlmIChsYW5nID09PSBcImpzb241XCIpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGltcG9ydF9qc29uNS5kZWZhdWx0LnBhcnNlKGJsb2NrLmNvbnRlbnQpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIEpTT041IGZvcm1hdCBvZiA8JHtibG9jay50eXBlfT4gY29udGVudCBpbiAke2ZpbGVQYXRofVxuJHtlcnIubWVzc2FnZX1gKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAobGFuZyA9PT0gXCJqc29uXCIpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoYmxvY2suY29udGVudCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgSlNPTiBmb3JtYXQgb2YgPCR7YmxvY2sudHlwZX0+IGNvbnRlbnQgaW4gJHtmaWxlUGF0aH1cbiR7ZXJyLm1lc3NhZ2V9YCk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGxhbmcgPT09IFwidG9tbFwiKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBpbXBvcnRfdG9tbC5kZWZhdWx0LnBhcnNlKGJsb2NrLmNvbnRlbnQpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIFRPTUwgZm9ybWF0IG9mIDwke2Jsb2NrLnR5cGV9PiBjb250ZW50IGluICR7ZmlsZVBhdGh9XG4ke2Vyci5tZXNzYWdlfWApO1xuICAgIH1cbiAgfSBlbHNlIGlmIChsYW5nID09PSBcInlhbWxcIiB8fCBsYW5nID09PSBcInltbFwiKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBpbXBvcnRfeWFtbC5kZWZhdWx0LnBhcnNlKGJsb2NrLmNvbnRlbnQpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIFlBTUwgZm9ybWF0IG9mIDwke2Jsb2NrLnR5cGV9PiBjb250ZW50IGluICR7ZmlsZVBhdGh9XG4ke2Vyci5tZXNzYWdlfWApO1xuICAgIH1cbiAgfVxufVxuXG4vLyBzcmMvY29uc3RhbnRzLnRzXG52YXIgTU9EVUxFX1ZJUlRVQUxfSUQgPSBcInZpcnR1YWw6YXV0b3JvdXRlclwiO1xudmFyIE1PRFVMRV9SRVFVRVNUX0lEID0gXCIvQHZpdGUtcGx1Z2luLWF1dG9yb3V0ZXIvZ2VuZXJhdGVkLXBhZ2VzXCI7XG5cbi8vIHNyYy91dGlscy50c1xudmFyIHJvdXRlQmxvY2tDYWNoZSA9IG5ldyBNYXAoKTtcbmZ1bmN0aW9uIGV4dGVuc2lvbnNUb0dsb2IoZXh0ZW5zaW9ucykge1xuICByZXR1cm4gZXh0ZW5zaW9ucy5sZW5ndGggPiAxID8gYHske2V4dGVuc2lvbnMuam9pbihcIixcIil9fWAgOiBleHRlbnNpb25zWzBdIHx8IFwiXCI7XG59XG5mdW5jdGlvbiBpc1BhZ2VzRGlyKHBhdGgsIG9wdGlvbnMpIHtcbiAgZm9yIChjb25zdCBwYWdlIG9mIG9wdGlvbnMucGFnZXNEaXIpIHtcbiAgICBjb25zdCBkaXJQYXRoID0gKDAsIGltcG9ydF91dGlscy5zbGFzaCkoKDAsIGltcG9ydF9wYXRoLnJlc29sdmUpKG9wdGlvbnMucm9vdCwgcGFnZSkpO1xuICAgIGlmIChwYXRoLnN0YXJ0c1dpdGgoZGlyUGF0aCkpXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5mdW5jdGlvbiBpc1RhcmdldChwYXRoLCBvcHRpb25zKSB7XG4gIHJldHVybiBpc1BhZ2VzRGlyKHBhdGgsIG9wdGlvbnMpICYmIG9wdGlvbnMuZXh0ZW5zaW9uc1JFLnRlc3QocGF0aCk7XG59XG52YXIgZGVidWcgPSB7XG4gIGhtcjogKDAsIGltcG9ydF9kZWJ1Zy5kZWZhdWx0KShcInZpdGUtcGx1Z2luLWF1dG9yb3V0ZXI6aG1yXCIpLFxuICBwYXJzZXI6ICgwLCBpbXBvcnRfZGVidWcuZGVmYXVsdCkoXCJ2aXRlLXBsdWdpbi1hdXRvcm91dGVyOnBhcnNlclwiKSxcbiAgZ2VuOiAoMCwgaW1wb3J0X2RlYnVnLmRlZmF1bHQpKFwidml0ZS1wbHVnaW4tYXV0b3JvdXRlcjpnZW5cIiksXG4gIG9wdGlvbnM6ICgwLCBpbXBvcnRfZGVidWcuZGVmYXVsdCkoXCJ2aXRlLXBsdWdpbi1hdXRvcm91dGVyOm9wdGlvbnNcIiksXG4gIGNhY2hlOiAoMCwgaW1wb3J0X2RlYnVnLmRlZmF1bHQpKFwidml0ZS1wbHVnaW4tYXV0b3JvdXRlcjpjYWNoZVwiKSxcbiAgcGFnZXM6ICgwLCBpbXBvcnRfZGVidWcuZGVmYXVsdCkoXCJ2aXRlLXBsdWdpbi1hdXRvcm91dGVyOnBhZ2VzXCIpXG59O1xuZnVuY3Rpb24gcmVzb2x2ZUltcG9ydE1vZGUoZmlsZXBhdGgsIG9wdGlvbnMpIHtcbiAgY29uc3QgbW9kZSA9IG9wdGlvbnMuaW1wb3J0TW9kZTtcbiAgaWYgKHR5cGVvZiBtb2RlID09PSBcImZ1bmN0aW9uXCIpXG4gICAgcmV0dXJuIG1vZGUoZmlsZXBhdGgpO1xuICBmb3IgKGNvbnN0IHBhZ2VEaXIgb2Ygb3B0aW9ucy5wYWdlc0Rpcikge1xuICAgIGlmIChvcHRpb25zLnN5bmNJbmRleCAmJiBwYWdlRGlyID09PSBcIlwiICYmIGZpbGVwYXRoID09PSBgLyR7cGFnZURpcn0vaW5kZXgudnVlYClcbiAgICAgIHJldHVybiBcInN5bmNcIjtcbiAgfVxuICByZXR1cm4gbW9kZTtcbn1cbmZ1bmN0aW9uIHBhdGhUb05hbWUoZmlsZXBhdGgpIHtcbiAgcmV0dXJuIGZpbGVwYXRoLnJlcGxhY2UoL1tfLlxcLVxcXFwvXS9nLCBcIl9cIikucmVwbGFjZSgvW1s6XFxdKCldL2csIFwiJFwiKTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGdldFJvdXRlQmxvY2socGF0aCwgb3B0aW9ucykge1xuICBjb25zdCBjb250ZW50ID0gaW1wb3J0X2ZzLmRlZmF1bHQucmVhZEZpbGVTeW5jKHBhdGgsIFwidXRmOFwiKTtcbiAgY29uc3QgcGFyc2VkID0gYXdhaXQgcGFyc2VTRkMoY29udGVudCk7XG4gIGNvbnN0IGJsb2NrU3RyID0gcGFyc2VkLmN1c3RvbUJsb2Nrcy5maW5kKChiKSA9PiBiLnR5cGUgPT09IFwicm91dGVcIik7XG4gIGlmICghYmxvY2tTdHIpXG4gICAgcmV0dXJuIHt9O1xuICBjb25zdCByZXN1bHQgPSBwYXJzZUN1c3RvbUJsb2NrKGJsb2NrU3RyLCBwYXRoLCBvcHRpb25zKTtcbiAgZGVidWcucGFyc2VyKFwiJXM6ICVPXCIsIHBhdGgsIHJlc3VsdCk7XG4gIHJvdXRlQmxvY2tDYWNoZS5zZXQoKDAsIGltcG9ydF91dGlscy5zbGFzaCkocGF0aCksIHJlc3VsdCk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBnZXRQYWdlc1ZpcnR1YWxNb2R1bGUoc2VydmVyKSB7XG4gIGNvbnN0IHsgbW9kdWxlR3JhcGggfSA9IHNlcnZlcjtcbiAgY29uc3QgbW9kdWxlMiA9IG1vZHVsZUdyYXBoLmdldE1vZHVsZUJ5SWQoTU9EVUxFX1JFUVVFU1RfSUQpO1xuICBpZiAobW9kdWxlMikge1xuICAgIG1vZHVsZUdyYXBoLmludmFsaWRhdGVNb2R1bGUobW9kdWxlMik7XG4gICAgcmV0dXJuIG1vZHVsZTI7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5mdW5jdGlvbiByZXBsYWNlU3F1YXJlQnJhY2tldHMoYnVuZGxlKSB7XG4gIGNvbnN0IGZpbGVzID0gT2JqZWN0LmtleXMoYnVuZGxlKS5tYXAoKGkpID0+ICgwLCBpbXBvcnRfcGF0aC5iYXNlbmFtZSkoaSkpO1xuICBmb3IgKGNvbnN0IGNodW5rIG9mIE9iamVjdC52YWx1ZXMoYnVuZGxlKSkge1xuICAgIGNodW5rLmZpbGVOYW1lID0gY2h1bmsuZmlsZU5hbWUucmVwbGFjZSgvKFxcW3xcXF0pL2csIFwiX1wiKTtcbiAgICBpZiAoY2h1bmsudHlwZSA9PT0gXCJjaHVua1wiKSB7XG4gICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgZmlsZXMpXG4gICAgICAgIGNodW5rLmNvZGUgPSBjaHVuay5jb2RlLnJlcGxhY2UoZmlsZSwgZmlsZS5yZXBsYWNlKC8oXFxbfFxcXSkvZywgXCJfXCIpKTtcbiAgICB9XG4gIH1cbn1cbmFzeW5jIGZ1bmN0aW9uIGlzUm91dGVCbG9ja0NoYW5nZWQoZmlsZVBhdGgsIG9wdGlvbnMpIHtcbiAgZGVidWcuY2FjaGUocm91dGVCbG9ja0NhY2hlKTtcbiAgY29uc3Qgb2xkUm91dGVCbG9jayA9IHJvdXRlQmxvY2tDYWNoZS5nZXQoZmlsZVBhdGgpO1xuICBjb25zdCByb3V0ZUJsb2NrID0gYXdhaXQgZ2V0Um91dGVCbG9jayhmaWxlUGF0aCwgb3B0aW9ucyk7XG4gIGRlYnVnLmhtcihcIiVzIG9sZDogJU9cIiwgZmlsZVBhdGgsIG9sZFJvdXRlQmxvY2spO1xuICBkZWJ1Zy5obXIoXCIlcyBuZXc6ICVPXCIsIGZpbGVQYXRoLCByb3V0ZUJsb2NrKTtcbiAgcmV0dXJuICEoMCwgaW1wb3J0X2RlZXBfZXF1YWwuZGVmYXVsdCkob2xkUm91dGVCbG9jaywgcm91dGVCbG9jayk7XG59XG5cbi8vIHNyYy9zdHJpbmdpZnkudHNcbnZhciBjb21wb25lbnRSRSA9IC9cImNvbXBvbmVudFwiOihcIiguKj8pXCIpL2c7XG52YXIgaGFzRnVuY3Rpb25SRSA9IC9cIig/OnByb3BzfGJlZm9yZUVudGVyKVwiOihcIiguKj8pXCIpL2c7XG52YXIgc2luZ2xlbGluZUNvbW1lbnRzUkUgPSAvXFwvXFwvLiovZztcbnZhciBtdWx0aWxpbmVDb21tZW50c1JFID0gL1xcL1xcKigufFtcXHJcXG5dKSo/XFwqXFwvL2dtO1xuZnVuY3Rpb24gcmVwbGFjZUZ1bmN0aW9uKF8sIHZhbHVlKSB7XG4gIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEZ1bmN0aW9uIHx8IHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgY29uc3QgZm5Cb2R5ID0gdmFsdWUudG9TdHJpbmcoKS5yZXBsYWNlKG11bHRpbGluZUNvbW1lbnRzUkUsIFwiXCIpLnJlcGxhY2Uoc2luZ2xlbGluZUNvbW1lbnRzUkUsIFwiXCIpLnJlcGxhY2UoLyhcXHR8XFxufFxccnxcXHMpL2csIFwiXCIpO1xuICAgIGlmIChmbkJvZHkubGVuZ3RoIDwgOCB8fCBmbkJvZHkuc3Vic3RyaW5nKDAsIDgpICE9PSBcImZ1bmN0aW9uXCIpXG4gICAgICByZXR1cm4gYF9OdUZyUmFfJHtmbkJvZHl9YDtcbiAgICByZXR1cm4gZm5Cb2R5O1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIHN0cmluZ2lmeVJvdXRlcyhwcmVwYXJlZFJvdXRlcywgb3B0aW9ucykge1xuICBjb25zdCBpbXBvcnRzID0gW107XG4gIGZ1bmN0aW9uIGNvbXBvbmVudFJlcGxhY2VyKHN0ciwgcmVwbGFjZVN0ciwgcGF0aCkge1xuICAgIGNvbnN0IG1vZGUgPSByZXNvbHZlSW1wb3J0TW9kZShwYXRoLCBvcHRpb25zKTtcbiAgICBpZiAobW9kZSA9PT0gXCJzeW5jXCIpIHtcbiAgICAgIGNvbnN0IGltcG9ydE5hbWUgPSBwYXRoVG9OYW1lKHBhdGgpO1xuICAgICAgY29uc3QgaW1wb3J0U3RyID0gYGltcG9ydCAke2ltcG9ydE5hbWV9IGZyb20gJyR7cGF0aH0nYDtcbiAgICAgIGlmICghaW1wb3J0cy5pbmNsdWRlcyhpbXBvcnRTdHIpKVxuICAgICAgICBpbXBvcnRzLnB1c2goaW1wb3J0U3RyKTtcbiAgICAgIHJldHVybiBzdHIucmVwbGFjZShyZXBsYWNlU3RyLCBpbXBvcnROYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKHJlcGxhY2VTdHIsIGAoKSA9PiBpbXBvcnQoJyR7cGF0aH0nKWApO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBmdW5jdGlvblJlcGxhY2VyKHN0ciwgcmVwbGFjZVN0ciwgY29udGVudCkge1xuICAgIGlmIChjb250ZW50LnN0YXJ0c1dpdGgoXCJmdW5jdGlvblwiKSlcbiAgICAgIHJldHVybiBzdHIucmVwbGFjZShyZXBsYWNlU3RyLCBjb250ZW50KTtcbiAgICBpZiAoY29udGVudC5zdGFydHNXaXRoKFwiX051RnJSYV9cIikpXG4gICAgICByZXR1cm4gc3RyLnJlcGxhY2UocmVwbGFjZVN0ciwgY29udGVudC5zbGljZSg4KSk7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxuICBjb25zdCBzdHJpbmdSb3V0ZXMgPSBKU09OLnN0cmluZ2lmeShwcmVwYXJlZFJvdXRlcywgcmVwbGFjZUZ1bmN0aW9uKS5yZXBsYWNlKGNvbXBvbmVudFJFLCBjb21wb25lbnRSZXBsYWNlcikucmVwbGFjZShoYXNGdW5jdGlvblJFLCBmdW5jdGlvblJlcGxhY2VyKTtcbiAgcmV0dXJuIHtcbiAgICBpbXBvcnRzLFxuICAgIHN0cmluZ1JvdXRlc1xuICB9O1xufVxuXG4vLyBzcmMvZ2VuZXJhdGUudHNcbmZ1bmN0aW9uIGdlbmVyYXRlQ2xpZW50Q29kZShyb3V0ZXMsIG9wdGlvbnMpIHtcbiAgY29uc3QgeyBpbXBvcnRzLCBzdHJpbmdSb3V0ZXMgfSA9IHN0cmluZ2lmeVJvdXRlcyhyb3V0ZXMsIG9wdGlvbnMpO1xuICByZXR1cm4gYCR7aW1wb3J0cy5qb2luKFwiO1xcblwiKX07XG5cbmNvbnN0IHJvdXRlcyA9ICR7c3RyaW5nUm91dGVzfTtcblxuZXhwb3J0IGRlZmF1bHQgcm91dGVzO2A7XG59XG5mdW5jdGlvbiBzb3J0UGFnZShwYWdlcykge1xuICByZXR1cm4gWy4uLnBhZ2VzXS5tYXAoKFtfLCB2YWx1ZV0pID0+IHZhbHVlKS5zb3J0KChhLCBiKSA9PiB7XG4gICAgaWYgKGEucGFyZW50cyAmJiAhYi5wYXJlbnRzKVxuICAgICAgcmV0dXJuIDE7XG4gICAgaWYgKCFhLnBhcmVudHMgJiYgYi5wYXJlbnRzKVxuICAgICAgcmV0dXJuIC0xO1xuICAgIGxldCBzbGFzaGEgPSAoYS5wYXRoLm1hdGNoKC9cXC8vZykgfHwgW10pLmxlbmd0aDtcbiAgICBsZXQgc2xhc2hiID0gKGIucGF0aC5tYXRjaCgvXFwvL2cpIHx8IFtdKS5sZW5ndGg7XG4gICAgaWYgKHNsYXNoYSAhPSBzbGFzaGIpIHtcbiAgICAgIHJldHVybiBzbGFzaGEgLSBzbGFzaGI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBhLnBhdGgubGVuZ3RoIC0gYi5wYXRoLmxlbmd0aDtcbiAgICB9XG4gIH0pO1xufVxuZnVuY3Rpb24gc29ydFJvdXRlcihzdGFjaykge1xuICByZXR1cm4gc3RhY2suc29ydCgoYSwgYikgPT4ge1xuICAgIGxldCBtYXRjaGEgPSBhLnBhdGgucmVwbGFjZSgvW15cXDpcXC9dL2csIFwiXCIpLmluZGV4T2YoXCI6XCIpO1xuICAgIG1hdGNoYSA9IG1hdGNoYSA8IDAgPyA5OTkgOiBtYXRjaGE7XG4gICAgbGV0IG1hdGNoYiA9IGIucGF0aC5yZXBsYWNlKC9bXlxcOlxcL10vZywgXCJcIikuaW5kZXhPZihcIjpcIik7XG4gICAgbWF0Y2hiID0gbWF0Y2hiIDwgMCA/IDk5OSA6IG1hdGNoYjtcbiAgICBsZXQgc2xhc2hhID0gKGEucGF0aC5tYXRjaCgvXFwvL2cpIHx8IFtdKS5sZW5ndGg7XG4gICAgbGV0IHNsYXNoYiA9IChiLnBhdGgubWF0Y2goL1xcLy9nKSB8fCBbXSkubGVuZ3RoO1xuICAgIGlmIChtYXRjaGEgIT0gbWF0Y2hiKSB7XG4gICAgICByZXR1cm4gbWF0Y2hiIC0gbWF0Y2hhO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoc2xhc2hhICE9IHNsYXNoYikge1xuICAgICAgICByZXR1cm4gc2xhc2hhIC0gc2xhc2hiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGEucGF0aC5sZW5ndGggLSBiLnBhdGgubGVuZ3RoO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5mdW5jdGlvbiBpbnNlcnRSb3V0ZXIoc3RhY2ssIHBhcmVudCwgcm91dGUpIHtcbiAgdmFyIF9hO1xuICBsZXQgaW5zZXJ0ZWQgPSBmYWxzZTtcbiAgaWYgKCFwYXJlbnQpIHtcbiAgICByb3V0ZS5wYXRoID0gXCIkXCIgKyByb3V0ZS5wYXRoO1xuICAgIHJvdXRlLmNoYWluID0gXCIkXCIgKyByb3V0ZS5jaGFpbjtcbiAgICBzdGFjay5wdXNoKHJvdXRlKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBmb3IgKGxldCBub2RlIG9mIHN0YWNrKSB7XG4gICAgaWYgKChfYSA9IG5vZGUuY2hhaW4pID09IG51bGwgPyB2b2lkIDAgOiBfYS5lbmRzV2l0aChwYXJlbnQpKSB7XG4gICAgICBpbnNlcnRlZCA9IHRydWU7XG4gICAgICByb3V0ZS5jaGFpbiA9IG5vZGUuY2hhaW4gKyByb3V0ZS5wYXRoO1xuICAgICAgbm9kZS5jaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW4gfHwgW107XG4gICAgICBub2RlLmNoaWxkcmVuLnB1c2gocm91dGUpO1xuICAgIH1cbiAgICBpZiAobm9kZS5jaGlsZHJlbikge1xuICAgICAgaWYgKGluc2VydFJvdXRlcihub2RlLmNoaWxkcmVuLCBwYXJlbnQsIHJvdXRlKSkge1xuICAgICAgICBpbnNlcnRlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIDtcbiAgcmV0dXJuIGluc2VydGVkO1xufVxuZnVuY3Rpb24gcHJlcGFyZVJvdXRlcyhzdGFjaywgb3B0aW9ucywgcm9vdCkge1xuICB2YXIgX2E7XG4gIGxldCByZXBlYXQgPSBuZXcgU2V0KCk7XG4gIGZvciAobGV0IG5vZGUgb2Ygc3RhY2spIHtcbiAgICBpZiAocmVwZWF0Lmhhcyhub2RlLnBhdGgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFt2aXRlLXBsdWdpbi1hdXR1cm91dGVyXSBkdXBsaWNhdGUgcm91dGUgZm9yICR7bm9kZS5jb21wb25lbnR9YCk7XG4gICAgfVxuICAgIHJlcGVhdC5hZGQobm9kZS5wYXRoKTtcbiAgICBkZWxldGUgbm9kZS5jaGFpbjtcbiAgICBpZiAocm9vdCkge1xuICAgICAgbm9kZS5wYXRoID0gbm9kZS5wYXRoLnJlcGxhY2UoL15cXCQvLCBcIlwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZS5wYXRoID0gbm9kZS5wYXRoLnJlcGxhY2UoL15cXC8vLCBcIlwiKTtcbiAgICB9XG4gICAgaWYgKCFvcHRpb25zLnJlYWN0KSB7XG4gICAgICBub2RlLnByb3BzID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9kZS5yb3V0ZXMgPSBub2RlLmNoaWxkcmVuO1xuICAgICAgZGVsZXRlIG5vZGUuY2hpbGRyZW47XG4gICAgICBub2RlLmV4YWN0ID0gdHJ1ZTtcbiAgICAgIGRlbGV0ZSBub2RlLm5hbWU7XG4gICAgfVxuICAgIGlmIChub2RlLmNoaWxkcmVuKSB7XG4gICAgICBub2RlLmNoaWxkcmVuID0gcHJlcGFyZVJvdXRlcyhub2RlLmNoaWxkcmVuLCBvcHRpb25zKTtcbiAgICB9XG4gICAgT2JqZWN0LmFzc2lnbihub2RlLCAoKF9hID0gb3B0aW9ucy5leHRlbmRSb3V0ZSkgPT0gbnVsbCA/IHZvaWQgMCA6IF9hLmNhbGwob3B0aW9ucywgbm9kZSkpIHx8IHt9KTtcbiAgfVxuICByZXR1cm4gc29ydFJvdXRlcihzdGFjayk7XG59XG5mdW5jdGlvbiBnZW5lcmF0ZVJvdXRlcyhwYWdlcywgb3B0aW9ucykge1xuICBjb25zdCB7IG51eHRTdHlsZSB9ID0gb3B0aW9ucztcbiAgbGV0IHN0YWNrID0gW107XG4gIGNvbnN0IHNvcnRwYWdlcyA9IHNvcnRQYWdlKHBhZ2VzKTtcbiAgc29ydHBhZ2VzLmZvckVhY2goKHBhZ2UpID0+IHtcbiAgICBsZXQgeyBuYW1lLCBwYXRoLCBwYXJlbnRzLCBjb21wb25lbnQgfSA9IHBhZ2U7XG4gICAgaWYgKHR5cGVvZiBwYXJlbnRzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBwYXJlbnRzID0gW3BhcmVudHNdO1xuICAgIH1cbiAgICBwYXJlbnRzLm1hcCgocGFyZW50KSA9PiB7XG4gICAgICBjb25zdCByb3V0ZSA9IHtcbiAgICAgICAgcGF0aCxcbiAgICAgICAgbmFtZSxcbiAgICAgICAgY2hhaW46IHBhcmVudCArIHBhdGgsXG4gICAgICAgIGNvbXBvbmVudFxuICAgICAgfTtcbiAgICAgIE9iamVjdC5hc3NpZ24ocm91dGUsIHBhZ2UpO1xuICAgICAgbGV0IGluc2VydGVkID0gaW5zZXJ0Um91dGVyKHN0YWNrLCBwYXJlbnQsIHJvdXRlKTtcbiAgICAgIGlmICghaW5zZXJ0ZWQpIHtcbiAgICAgICAgcGF0aCA9IHBhdGgucmVwbGFjZSgvXihbXi8kXSkvLCBcIi8kMVwiKTtcbiAgICAgICAgcGFyZW50ID0gcGFyZW50LnJlcGxhY2UoL15cXCQvLCBcIlwiKTtcbiAgICAgICAgcGFyZW50ID0gcGFyZW50LnJlcGxhY2UoL14oW14vJF0pLywgXCIvJDFcIik7XG4gICAgICAgIHJvdXRlLnBhdGggPSBwYXJlbnQgKyBwYXRoO1xuICAgICAgICByb3V0ZS5wYXRoID0gXCIkXCIgKyBwYXJlbnQgKyBwYXRoLCBzdGFjay5wdXNoKHJvdXRlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG4gIGNvbnN0IGZpbmFsUm91dGVzID0gcHJlcGFyZVJvdXRlcyhzdGFjaywgb3B0aW9ucywgdHJ1ZSk7XG4gIHJldHVybiBmaW5hbFJvdXRlcztcbn1cblxuLy8gc3JjL29wdGlvbnMudHNcbnZhciBpbXBvcnRfcGF0aDIgPSBfX3RvTW9kdWxlKHJlcXVpcmUoXCJwYXRoXCIpKTtcblxuLy8gc3JjL2ZpbGVzLnRzXG52YXIgaW1wb3J0X2Zhc3RfZ2xvYiA9IF9fdG9Nb2R1bGUocmVxdWlyZShcImZhc3QtZ2xvYlwiKSk7XG5mdW5jdGlvbiBnZXRJZ25vcmUoZXhjbHVkZSkge1xuICByZXR1cm4gW1wibm9kZV9tb2R1bGVzXCIsIFwiLmdpdFwiLCBcIioqL19fKl9fLyoqXCIsIC4uLmV4Y2x1ZGVdO1xufVxuZnVuY3Rpb24gZ2V0UGFnZURpcnMocGFnZURpck9wdGlvbnMsIHJvb3QsIGV4Y2x1ZGUpIHtcbiAgY29uc3QgZGlycyA9IGltcG9ydF9mYXN0X2dsb2IuZGVmYXVsdC5zeW5jKHBhZ2VEaXJPcHRpb25zLCB7XG4gICAgaWdub3JlOiBnZXRJZ25vcmUoZXhjbHVkZSksXG4gICAgb25seURpcmVjdG9yaWVzOiB0cnVlLFxuICAgIGRvdDogdHJ1ZSxcbiAgICB1bmlxdWU6IHRydWUsXG4gICAgY3dkOiByb290XG4gIH0pO1xuICByZXR1cm4gZGlycztcbn1cbmZ1bmN0aW9uIGdldFBhZ2VGaWxlcyhwYXRoLCBvcHRpb25zKSB7XG4gIGNvbnN0IHsgZXhjbHVkZSwgZXh0ZW5zaW9ucyB9ID0gb3B0aW9ucztcbiAgY29uc3QgZXh0ID0gZXh0ZW5zaW9uc1RvR2xvYihleHRlbnNpb25zKTtcbiAgY29uc3QgZmlsZXMgPSBpbXBvcnRfZmFzdF9nbG9iLmRlZmF1bHQuc3luYyhgKiovKi4ke2V4dH1gLCB7XG4gICAgaWdub3JlOiBnZXRJZ25vcmUoZXhjbHVkZSksXG4gICAgb25seUZpbGVzOiB0cnVlLFxuICAgIGN3ZDogcGF0aFxuICB9KTtcbiAgcmV0dXJuIGZpbGVzO1xufVxuXG4vLyBzcmMvb3B0aW9ucy50c1xuZnVuY3Rpb24gcmVzb2x2ZVBhZ2VEaXJzKHBhZ2VzRGlyLCByb290LCBleGNsdWRlKSB7XG4gIHBhZ2VzRGlyID0gKDAsIGltcG9ydF91dGlscy50b0FycmF5KShwYWdlc0Rpcik7XG4gIHJldHVybiBwYWdlc0Rpci5mbGF0TWFwKChwYWdlc0RpcjIpID0+IHtcbiAgICBwYWdlc0RpcjIgPSAoMCwgaW1wb3J0X3V0aWxzLnNsYXNoKSgoMCwgaW1wb3J0X3BhdGgyLnJlc29sdmUpKHJvb3QsIHBhZ2VzRGlyMikpLnJlcGxhY2UoYCR7cm9vdH0vYCwgXCJcIik7XG4gICAgcmV0dXJuIGdldFBhZ2VEaXJzKHBhZ2VzRGlyMiwgcm9vdCwgZXhjbHVkZSk7XG4gIH0pO1xufVxuZnVuY3Rpb24gcmVzb2x2ZU9wdGlvbnModXNlck9wdGlvbnMsIHZpdGVSb290KSB7XG4gIGNvbnN0IHtcbiAgICBwYWdlc0RpciA9IFtcInNyYy9wYWdlc1wiXSxcbiAgICByb3V0ZUJsb2NrTGFuZyA9IFwianNvbjVcIixcbiAgICBleGNsdWRlID0gW10sXG4gICAgc3luY0luZGV4ID0gdHJ1ZSxcbiAgICByZXBsYWNlU3F1YXJlQnJhY2tldHM6IHJlcGxhY2VTcXVhcmVCcmFja2V0czIgPSBmYWxzZSxcbiAgICBudXh0U3R5bGUgPSBmYWxzZSxcbiAgICByZWFjdCA9IGZhbHNlLFxuICAgIGV4dGVuZFJvdXRlLFxuICAgIG9uUm91dGVzR2VuZXJhdGVkLFxuICAgIG9uQ2xpZW50R2VuZXJhdGVkXG4gIH0gPSB1c2VyT3B0aW9ucztcbiAgY29uc3Qgcm9vdCA9IHZpdGVSb290IHx8ICgwLCBpbXBvcnRfdXRpbHMuc2xhc2gpKHByb2Nlc3MuY3dkKCkpO1xuICBjb25zdCBpbXBvcnRNb2RlID0gdXNlck9wdGlvbnMuaW1wb3J0TW9kZSB8fCAocmVhY3QgPyBcInN5bmNcIiA6IFwiYXN5bmNcIik7XG4gIGNvbnN0IGV4dGVuc2lvbnMgPSB1c2VyT3B0aW9ucy5leHRlbnNpb25zIHx8IChyZWFjdCA/IFtcInRzeFwiLCBcImpzeFwiXSA6IFtcInZ1ZVwiLCBcInRzXCIsIFwianNcIl0pO1xuICBjb25zdCBleHRlbnNpb25zUkUgPSBuZXcgUmVnRXhwKGBcXFxcLigke2V4dGVuc2lvbnMuam9pbihcInxcIil9KSRgKTtcbiAgY29uc3QgcmVzb2x2ZWRQYWdlc0RpciA9IHJlc29sdmVQYWdlRGlycyhwYWdlc0Rpciwgcm9vdCwgZXhjbHVkZSk7XG4gIGNvbnN0IHJlc29sdmVkT3B0aW9ucyA9IHtcbiAgICBwYWdlc0RpcjogcmVzb2x2ZWRQYWdlc0RpcixcbiAgICByb290LFxuICAgIHJlYWN0LFxuICAgIGV4Y2x1ZGUsXG4gICAgc3luY0luZGV4LFxuICAgIG51eHRTdHlsZSxcbiAgICBleHRlbnNpb25zLFxuICAgIGltcG9ydE1vZGUsXG4gICAgZXh0ZW5zaW9uc1JFLFxuICAgIHJvdXRlQmxvY2tMYW5nLFxuICAgIHJlcGxhY2VTcXVhcmVCcmFja2V0czogcmVwbGFjZVNxdWFyZUJyYWNrZXRzMixcbiAgICBleHRlbmRSb3V0ZSxcbiAgICBvblJvdXRlc0dlbmVyYXRlZCxcbiAgICBvbkNsaWVudEdlbmVyYXRlZFxuICB9O1xuICByZXR1cm4gcmVzb2x2ZWRPcHRpb25zO1xufVxuXG4vLyBzcmMvcGFnZXMudHNcbnZhciBpbXBvcnRfcGF0aDMgPSBfX3RvTW9kdWxlKHJlcXVpcmUoXCJwYXRoXCIpKTtcbmZ1bmN0aW9uIG1hdGNoRm9ybWF0KHBhdGgpIHtcbiAgcGF0aCA9IHBhdGgucmVwbGFjZSgvXyhbXlxcW1xcXVxcXFxcXC9dKikvZywgXCI6JDFcIik7XG4gIHBhdGggPSBwYXRoLnJlcGxhY2UoLyhcXFsoXFwuXFwuXFwuKT8oW15cXF1cXC9dKilcXF0pL2csIFwiOiQzXCIpO1xuICBwYXRoID0gcGF0aC5yZXBsYWNlKC8oXFxbKFteXFxbXFxdXSspXFxdKS9nLCBcIjokMlwiKTtcbiAgcGF0aCA9IHBhdGgucmVwbGFjZSgvKF58XFwvKShcXDopKFxcL3wkKS9nLCBcIiQxOmFueSokM1wiKTtcbiAgcGF0aCA9IHBhdGgucmVwbGFjZSgvKF58XFwvKShbXlxcXVxcL10qKT8oXFw6KShcXC98JCkvZywgXCIkMSQyOmFueSQ0XCIpO1xuICByZXR1cm4gcGF0aDtcbn1cbmFzeW5jIGZ1bmN0aW9uIHNldFBhZ2UocGFnZXMsIGRpciwgZmlsZSwgb3B0aW9ucykge1xuICBsZXQgZXh0ZW5zaW9uID0gKDAsIGltcG9ydF9wYXRoMy5leHRuYW1lKShmaWxlKS5zbGljZSgxKTtcbiAgbGV0IHBhcmVudHMgPSAoMCwgaW1wb3J0X3BhdGgzLmRpcm5hbWUpKGZpbGUpLnJlcGxhY2UoZGlyLCBcIlwiKTtcbiAgbGV0IGZpbGVwYXRoID0gKDAsIGltcG9ydF91dGlscy5zbGFzaCkoKDAsIGltcG9ydF9wYXRoMy5yZXNvbHZlKShvcHRpb25zLnJvb3QsIGZpbGUpKTtcbiAgbGV0IGZpbGVuYW1lID0gKDAsIGltcG9ydF9wYXRoMy5iYXNlbmFtZSkoZmlsZSkucmVwbGFjZShvcHRpb25zLmV4dGVuc2lvbnNSRSwgXCJcIik7XG4gIGZpbGVuYW1lID0gbWF0Y2hGb3JtYXQoZmlsZW5hbWUpO1xuICBwYXJlbnRzID0gbWF0Y2hGb3JtYXQocGFyZW50cyk7XG4gIGxldCBwYWdlID0ge1xuICAgIG5hbWU6IGAke2ZpbGV9YCxcbiAgICBwYXRoOiBgLyR7ZmlsZW5hbWV9YCxcbiAgICBwYXJlbnRzOiBgJHtwYXJlbnRzfWAsXG4gICAgY29tcG9uZW50OiBgLyR7ZmlsZX1gXG4gIH07XG4gIGxldCBibG9jayA9IHt9O1xuICBpZiAoW1widnVlXCIsIFwibWRcIl0uaW5jbHVkZXMoZXh0ZW5zaW9uKSkge1xuICAgIGJsb2NrID0gYXdhaXQgZ2V0Um91dGVCbG9jayhmaWxlcGF0aCwgb3B0aW9ucyk7XG4gIH1cbiAgT2JqZWN0LmFzc2lnbihwYWdlLCBibG9jayk7XG4gIHBhZ2UucGF0aCA9IHBhZ2UucGF0aC5yZXBsYWNlKC9eKFteLyRdKS8sIFwiLyQxXCIpO1xuICBwYWdlcy5zZXQoZmlsZSwgcGFnZSk7XG59XG5hc3luYyBmdW5jdGlvbiByZXNvbHZlUGFnZXMob3B0aW9ucykge1xuICBjb25zdCBkaXJzID0gKDAsIGltcG9ydF91dGlscy50b0FycmF5KShvcHRpb25zLnBhZ2VzRGlyKTtcbiAgY29uc3QgcGFnZXMgPSBuZXcgTWFwKCk7XG4gIGNvbnN0IHBhZ2VEaXJGaWxlcyA9IGRpcnMubWFwKChkaXIpID0+IHtcbiAgICBjb25zdCBwYWdlUGF0aCA9ICgwLCBpbXBvcnRfdXRpbHMuc2xhc2gpKCgwLCBpbXBvcnRfcGF0aDMucmVzb2x2ZSkob3B0aW9ucy5yb290LCBkaXIpKTtcbiAgICByZXR1cm4ge1xuICAgICAgZGlyLFxuICAgICAgZmlsZXM6IGdldFBhZ2VGaWxlcyhwYWdlUGF0aCwgb3B0aW9ucylcbiAgICB9O1xuICB9KTtcbiAgZm9yIChjb25zdCByb3cgb2YgcGFnZURpckZpbGVzKSB7XG4gICAgZm9yIChjb25zdCBmaWxlIG9mIHJvdy5maWxlcykge1xuICAgICAgYXdhaXQgc2V0UGFnZShwYWdlcywgcm93LmRpciwgKDAsIGltcG9ydF9wYXRoMy5qb2luKShyb3cuZGlyLCBmaWxlKSwgb3B0aW9ucyk7XG4gICAgfVxuICB9XG4gIHJldHVybiBwYWdlcztcbn1cbmFzeW5jIGZ1bmN0aW9uIGFkZFBhZ2UocGFnZXMsIGZpbGUsIG9wdGlvbnMpIHtcbiAgZmlsZSA9IGZpbGUucmVwbGFjZShvcHRpb25zLnJvb3QsIFwiXCIpO1xuICBjb25zdCBwYWdlRGlyID0gb3B0aW9ucy5wYWdlc0Rpci5maW5kKChpKSA9PiB7XG4gICAgZmlsZS5zdGFydHNXaXRoKGAvJHtpfWApO1xuICB9KTtcbiAgaWYgKCFwYWdlRGlyKVxuICAgIHJldHVybjtcbiAgYXdhaXQgc2V0UGFnZShwYWdlcywgcGFnZURpciwgZmlsZSwgb3B0aW9ucyk7XG59XG5hc3luYyBmdW5jdGlvbiB1cGRhdGVQYWdlKHBhZ2VzLCBmaWxlLCBvcHRpb25zKSB7XG4gIGNvbnN0IHBhZ2UgPSBwYWdlcy5nZXQoZmlsZSk7XG4gIGlmIChwYWdlKSB7XG4gICAgY29uc3QgY3VzdG9tQmxvY2sgPSByb3V0ZUJsb2NrQ2FjaGUuZ2V0KGZpbGUpIHx8IG51bGw7XG4gICAgcGFnZS5jdXN0b21CbG9jayA9IGN1c3RvbUJsb2NrO1xuICAgIHBhZ2VzLnNldChmaWxlLCBwYWdlKTtcbiAgfVxuICBpZiAoZmlsZSA9PT0gXCJVTk1BVENIRURcIikge1xuICAgIGNvbnNvbGUubG9nKG9wdGlvbnMucm9vdCk7XG4gIH1cbn1cbmZ1bmN0aW9uIHJlbW92ZVBhZ2UocGFnZXMsIGZpbGUpIHtcbiAgcGFnZXMuZGVsZXRlKGZpbGUpO1xufVxuXG4vLyBzcmMvaG1yLnRzXG5mdW5jdGlvbiBoYW5kbGVITVIoc2VydmVyLCBwYWdlcywgb3B0aW9ucywgY2xlYXJSb3V0ZXMpIHtcbiAgY29uc3QgeyB3cywgd2F0Y2hlciB9ID0gc2VydmVyO1xuICBmdW5jdGlvbiBmdWxsUmVsb2FkKCkge1xuICAgIGdldFBhZ2VzVmlydHVhbE1vZHVsZShzZXJ2ZXIpO1xuICAgIGNsZWFyUm91dGVzKCk7XG4gICAgd3Muc2VuZCh7XG4gICAgICB0eXBlOiBcImZ1bGwtcmVsb2FkXCJcbiAgICB9KTtcbiAgfVxuICB3YXRjaGVyLm9uKFwiYWRkXCIsIGFzeW5jIChwYXRoKSA9PiB7XG4gICAgaWYgKC8odnVlLm1kKSQvLnRlc3QocGF0aCkpXG4gICAgICByZXR1cm47XG4gICAgY29uc3QgZmlsZSA9IHBhdGgucmVwbGFjZShvcHRpb25zLnJvb3QsIFwiXCIpO1xuICAgIGlmIChpc1RhcmdldChmaWxlLCBvcHRpb25zKSkge1xuICAgICAgYXdhaXQgYWRkUGFnZShwYWdlcywgZmlsZSwgb3B0aW9ucyk7XG4gICAgICBkZWJ1Zy5obXIoXCJhZGRcIiwgZmlsZSk7XG4gICAgICBmdWxsUmVsb2FkKCk7XG4gICAgfVxuICB9KTtcbiAgd2F0Y2hlci5vbihcInVubGlua1wiLCAocGF0aCkgPT4ge1xuICAgIGlmICgvKHZ1ZS5tZCkkLy50ZXN0KHBhdGgpKVxuICAgICAgcmV0dXJuO1xuICAgIGNvbnN0IGZpbGUgPSBwYXRoLnJlcGxhY2Uob3B0aW9ucy5yb290LCBcIlwiKTtcbiAgICBpZiAoaXNUYXJnZXQoZmlsZSwgb3B0aW9ucykpIHtcbiAgICAgIHJlbW92ZVBhZ2UocGFnZXMsIGZpbGUpO1xuICAgICAgZGVidWcuaG1yKFwicmVtb3ZlXCIsIGZpbGUpO1xuICAgICAgZnVsbFJlbG9hZCgpO1xuICAgIH1cbiAgfSk7XG4gIHdhdGNoZXIub24oXCJjaGFuZ2VcIiwgYXN5bmMgKHBhdGgpID0+IHtcbiAgICBpZiAoLyh2dWUubWQpJC8udGVzdChwYXRoKSlcbiAgICAgIHJldHVybjtcbiAgICBjb25zdCBmaWxlID0gcGF0aC5yZXBsYWNlKG9wdGlvbnMucm9vdCwgXCJcIik7XG4gICAgaWYgKGlzVGFyZ2V0KGZpbGUsIG9wdGlvbnMpICYmICFvcHRpb25zLnJlYWN0KSB7XG4gICAgICBjb25zdCBuZWVkUmVsb2FkID0gYXdhaXQgaXNSb3V0ZUJsb2NrQ2hhbmdlZChmaWxlLCBvcHRpb25zKTtcbiAgICAgIGlmIChuZWVkUmVsb2FkKSB7XG4gICAgICAgIHVwZGF0ZVBhZ2UocGFnZXMsIGZpbGUsIG9wdGlvbnMpO1xuICAgICAgICBkZWJ1Zy5obXIoXCJjaGFuZ2VcIiwgZmlsZSk7XG4gICAgICAgIGZ1bGxSZWxvYWQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG4vLyBzcmMvaW5kZXgudHNcbmZ1bmN0aW9uIHBhZ2VzUGx1Z2luKHVzZXJPcHRpb25zID0ge30pIHtcbiAgbGV0IGdlbmVyYXRlZFJvdXRlcyA9IG51bGw7XG4gIGxldCBvcHRpb25zO1xuICBsZXQgcGFnZXM7XG4gIHJldHVybiB7XG4gICAgbmFtZTogXCJ2aXRlLXBsdWdpbi1hdXRvcm91dGVyXCIsXG4gICAgZW5mb3JjZTogXCJwcmVcIixcbiAgICBhc3luYyB0cmFuc2Zvcm0oX2NvZGUsIGlkKSB7XG4gICAgICBpZiAoIS92dWUmdHlwZT1yb3V0ZS8udGVzdChpZCkpXG4gICAgICAgIHJldHVybjtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNvZGU6IFwiZXhwb3J0IGRlZmF1bHQge307XCIsXG4gICAgICAgIG1hcDogbnVsbFxuICAgICAgfTtcbiAgICB9LFxuICAgIGdlbmVyYXRlQnVuZGxlKF9vcHRpb25zLCBidW5kbGUpIHtcbiAgICAgIGlmIChvcHRpb25zLnJlcGxhY2VTcXVhcmVCcmFja2V0cylcbiAgICAgICAgcmVwbGFjZVNxdWFyZUJyYWNrZXRzKGJ1bmRsZSk7XG4gICAgfSxcbiAgICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyKSB7XG4gICAgICBoYW5kbGVITVIoc2VydmVyLCBwYWdlcywgb3B0aW9ucywgKCkgPT4ge1xuICAgICAgICBnZW5lcmF0ZWRSb3V0ZXMgPSBudWxsO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBhc3luYyBjb25maWdSZXNvbHZlZCh7IHJvb3QgfSkge1xuICAgICAgb3B0aW9ucyA9IHJlc29sdmVPcHRpb25zKHVzZXJPcHRpb25zLCByb290KTtcbiAgICAgIHBhZ2VzID0gYXdhaXQgcmVzb2x2ZVBhZ2VzKG9wdGlvbnMpO1xuICAgICAgZGVidWcub3B0aW9ucyhvcHRpb25zKTtcbiAgICAgIGRlYnVnLnBhZ2VzKHBhZ2VzKTtcbiAgICB9LFxuICAgIGFzeW5jIGxvYWQoaWQpIHtcbiAgICAgIHZhciBfYSwgX2I7XG4gICAgICBpZiAoaWQgIT09IE1PRFVMRV9SRVFVRVNUX0lEKVxuICAgICAgICByZXR1cm47XG4gICAgICBpZiAoIWdlbmVyYXRlZFJvdXRlcykge1xuICAgICAgICBnZW5lcmF0ZWRSb3V0ZXMgPSBbXTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBnZW5lcmF0ZWRSb3V0ZXMgPSBnZW5lcmF0ZVJvdXRlcyhwYWdlcywgb3B0aW9ucyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgfVxuICAgICAgICBnZW5lcmF0ZWRSb3V0ZXMgPSBhd2FpdCAoKF9hID0gb3B0aW9ucy5vblJvdXRlc0dlbmVyYXRlZCkgPT0gbnVsbCA/IHZvaWQgMCA6IF9hLmNhbGwob3B0aW9ucywgZ2VuZXJhdGVkUm91dGVzKSkgfHwgZ2VuZXJhdGVkUm91dGVzO1xuICAgICAgfVxuICAgICAgZGVidWcuZ2VuKFwicm91dGVzOiAlT1wiLCBnZW5lcmF0ZWRSb3V0ZXMpO1xuICAgICAgbGV0IGNsaWVudENvZGUgPSBnZW5lcmF0ZUNsaWVudENvZGUoZ2VuZXJhdGVkUm91dGVzLCBvcHRpb25zKTtcbiAgICAgIGNsaWVudENvZGUgPSBhd2FpdCAoKF9iID0gb3B0aW9ucy5vbkNsaWVudEdlbmVyYXRlZCkgPT0gbnVsbCA/IHZvaWQgMCA6IF9iLmNhbGwob3B0aW9ucywgY2xpZW50Q29kZSkpIHx8IGNsaWVudENvZGU7XG4gICAgICBkZWJ1Zy5nZW4oXCJjbGllbnQgY29kZTogJU9cIiwgY2xpZW50Q29kZSk7XG4gICAgICByZXR1cm4gY2xpZW50Q29kZTtcbiAgICB9LFxuICAgIHJlc29sdmVJZChpZCkge1xuICAgICAgcmV0dXJuIGlkLnN0YXJ0c1dpdGgoTU9EVUxFX1ZJUlRVQUxfSUQpID8gTU9EVUxFX1JFUVVFU1RfSUQgOiBudWxsO1xuICAgIH1cbiAgfTtcbn1cbnZhciBzcmNfZGVmYXVsdCA9IHBhZ2VzUGx1Z2luO1xuLy8gQW5ub3RhdGUgdGhlIENvbW1vbkpTIGV4cG9ydCBuYW1lcyBmb3IgRVNNIGltcG9ydCBpbiBub2RlOlxuMCAmJiAobW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdlbmVyYXRlUm91dGVzXG59KTtcbiIsICJpbXBvcnQgeyByZXNvbHZlIH0gZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgVnVlIGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWVcIjtcbmltcG9ydCBBdXRvIGZyb20gXCIuLi8uLi9kaXN0L1wiO1xuaW1wb3J0IE1hcmtkb3duIGZyb20gXCJ2aXRlLXBsdWdpbi1tZFwiO1xuY29uc3QgY29uZmlnID0gZGVmaW5lQ29uZmlnKHtcbiAgICBwbHVnaW5zOiBbXG4gICAgICAgIFZ1ZSh7XG4gICAgICAgICAgICBpbmNsdWRlOiBbL1xcLnZ1ZSQvLCAvXFwubWQkL10sXG4gICAgICAgIH0pLFxuICAgICAgICBBdXRvKHtcbiAgICAgICAgICAgIC8vIHBhZ2VzRGlyOiBbJ3NyYy9wYWdlcycsICdzcmMvcGFnZXMyJ10sXG4gICAgICAgICAgICBwYWdlc0RpcjogW1xuICAgICAgICAgICAgICAgIFwic3JjL2FkbWluL3BhZ2VzXCIsXG4gICAgICAgICAgICAgICAgXCJzcmMvZmVhdHVyZXMvKiovcGFnZXNcIixcbiAgICAgICAgICAgICAgICByZXNvbHZlKFwiL1VzZXJzL2hhbnJlYS9Xb3JrL09QRU4vdml0ZS1wbHVnaW4tYXV0b3JvdXRlci9leGFtcGxlcy92dWUtbW9kdWxlXCIsIFwiLi9zcmMvcGFnZXNcIiksXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgZXh0ZW5zaW9uczogW1widnVlXCIsIFwibWRcIl0sXG4gICAgICAgICAgICBzeW5jSW5kZXg6IHRydWUsXG4gICAgICAgICAgICByZXBsYWNlU3F1YXJlQnJhY2tldHM6IHRydWUsXG4gICAgICAgICAgICBleHRlbmRSb3V0ZShyb3V0ZTphbnkpIHtcbiAgICAgICAgICAgICAgICBpZiAocm91dGUubmFtZSA9PT0gXCJhYm91dFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvdXRlLnByb3BzID0gKHJvdXRlOmFueSkgPT4gKHsgXG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeTogcm91dGUucXVlcnkucSBcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyb3V0ZS5uYW1lID09PSBcImNvbXBvbmVudHNcIikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4ucm91dGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBiZWZvcmVFbnRlcjogKHJvdXRlOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJvdXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICAgIE1hcmtkb3duKCksXG4gICAgXSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBjb25maWc7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQSxRQUFJLFlBQVcsT0FBTztBQUN0QixRQUFJLGFBQVksT0FBTztBQUN2QixRQUFJLG9CQUFtQixPQUFPO0FBQzlCLFFBQUkscUJBQW9CLE9BQU87QUFDL0IsUUFBSSxnQkFBZSxPQUFPO0FBQzFCLFFBQUksZ0JBQWUsT0FBTyxVQUFVO0FBQ3BDLFFBQUksa0JBQWlCLENBQUMsV0FBVyxXQUFVLFFBQVEsY0FBYyxFQUFFLE9BQU87QUFDMUUsUUFBSSxXQUFXLENBQUMsUUFBUSxRQUFRO0FBQzlCLHNCQUFlO0FBQ2YsZUFBUyxRQUFRO0FBQ2YsbUJBQVUsUUFBUSxNQUFNLEVBQUUsS0FBSyxJQUFJLE9BQU8sWUFBWTtBQUFBO0FBRTFELFFBQUksY0FBYSxDQUFDLFFBQVEsU0FBUyxTQUFTO0FBQzFDLFVBQUksV0FBVyxPQUFPLFlBQVksWUFBWSxPQUFPLFlBQVksWUFBWTtBQUMzRSxpQkFBUyxPQUFPLG1CQUFrQjtBQUNoQyxjQUFJLENBQUMsY0FBYSxLQUFLLFFBQVEsUUFBUSxRQUFRO0FBQzdDLHVCQUFVLFFBQVEsS0FBSyxFQUFFLEtBQUssTUFBTSxRQUFRLE1BQU0sWUFBWSxDQUFFLFFBQU8sa0JBQWlCLFNBQVMsU0FBUyxLQUFLO0FBQUE7QUFFckgsYUFBTztBQUFBO0FBRVQsUUFBSSxjQUFhLENBQUMsWUFBWTtBQUM1QixhQUFPLFlBQVcsZ0JBQWUsV0FBVSxXQUFXLE9BQU8sVUFBUyxjQUFhLFlBQVksSUFBSSxXQUFXLFdBQVcsUUFBUSxjQUFjLGFBQWEsVUFBVSxFQUFFLEtBQUssTUFBTSxRQUFRLFNBQVMsWUFBWSxTQUFTLEVBQUUsT0FBTyxTQUFTLFlBQVksVUFBVTtBQUFBO0FBSW5RLGFBQVMsU0FBUztBQUFBLE1BQ2hCLFNBQVMsTUFBTTtBQUFBLE1BQ2YsZ0JBQWdCLE1BQU07QUFBQTtBQUl4QixRQUFJLFlBQVksWUFBVyxVQUFRO0FBQ25DLFFBQUksZUFBYyxZQUFXLFVBQVE7QUFDckMsUUFBSSxlQUFlLFlBQVcsVUFBUTtBQUN0QyxRQUFJLG9CQUFvQixZQUFXLFVBQVE7QUFDM0MsUUFBSSxlQUFlLFlBQVcsVUFBUTtBQUd0QyxRQUFJLGVBQWUsWUFBVyxVQUFRO0FBQ3RDLFFBQUksY0FBYyxZQUFXLFVBQVE7QUFDckMsUUFBSSxjQUFjLFlBQVcsVUFBUTtBQUNyQyw0QkFBd0IsTUFBTTtBQUM1QixVQUFJO0FBQ0YsY0FBTSxFQUFFLFVBQVUsTUFBTSxRQUFRLFVBQVUsS0FBSyxNQUFNLFlBQVcsVUFBUTtBQUN4RSxlQUFPLE1BQU0sTUFBTTtBQUFBLFVBQ2pCLEtBQUs7QUFBQSxXQUNKO0FBQUEsZUFDRyxHQUFOO0FBQ0EsY0FBTSxJQUFJLE1BQU07QUFBQTtBQUFBO0FBR3BCLDhCQUEwQixPQUFPLFVBQVUsU0FBUztBQUNsRCxVQUFJO0FBQ0osWUFBTSxPQUFRLE1BQUssTUFBTSxTQUFTLE9BQU8sS0FBSyxRQUFRO0FBQ3RELFVBQUksU0FBUyxTQUFTO0FBQ3BCLFlBQUk7QUFDRixpQkFBTyxhQUFhLFFBQVEsTUFBTSxNQUFNO0FBQUEsaUJBQ2pDLEtBQVA7QUFDQSxnQkFBTSxJQUFJLE1BQU0sNEJBQTRCLE1BQU0sb0JBQW9CO0FBQUEsRUFDMUUsSUFBSTtBQUFBO0FBQUEsaUJBRU8sU0FBUyxRQUFRO0FBQzFCLFlBQUk7QUFDRixpQkFBTyxLQUFLLE1BQU0sTUFBTTtBQUFBLGlCQUNqQixLQUFQO0FBQ0EsZ0JBQU0sSUFBSSxNQUFNLDJCQUEyQixNQUFNLG9CQUFvQjtBQUFBLEVBQ3pFLElBQUk7QUFBQTtBQUFBLGlCQUVPLFNBQVMsUUFBUTtBQUMxQixZQUFJO0FBQ0YsaUJBQU8sWUFBWSxRQUFRLE1BQU0sTUFBTTtBQUFBLGlCQUNoQyxLQUFQO0FBQ0EsZ0JBQU0sSUFBSSxNQUFNLDJCQUEyQixNQUFNLG9CQUFvQjtBQUFBLEVBQ3pFLElBQUk7QUFBQTtBQUFBLGlCQUVPLFNBQVMsVUFBVSxTQUFTLE9BQU87QUFDNUMsWUFBSTtBQUNGLGlCQUFPLFlBQVksUUFBUSxNQUFNLE1BQU07QUFBQSxpQkFDaEMsS0FBUDtBQUNBLGdCQUFNLElBQUksTUFBTSwyQkFBMkIsTUFBTSxvQkFBb0I7QUFBQSxFQUN6RSxJQUFJO0FBQUE7QUFBQTtBQUFBO0FBTU4sUUFBSSxvQkFBb0I7QUFDeEIsUUFBSSxvQkFBb0I7QUFHeEIsUUFBSSxrQkFBa0IsSUFBSTtBQUMxQiw4QkFBMEIsWUFBWTtBQUNwQyxhQUFPLFdBQVcsU0FBUyxJQUFJLElBQUksV0FBVyxLQUFLLFVBQVUsV0FBVyxNQUFNO0FBQUE7QUFFaEYsd0JBQW9CLE1BQU0sU0FBUztBQUNqQyxpQkFBVyxRQUFRLFFBQVEsVUFBVTtBQUNuQyxjQUFNLFVBQVcsSUFBRyxhQUFhLE9BQVEsSUFBRyxhQUFZLFNBQVMsUUFBUSxNQUFNO0FBQy9FLFlBQUksS0FBSyxXQUFXO0FBQ2xCLGlCQUFPO0FBQUE7QUFFWCxhQUFPO0FBQUE7QUFFVCxzQkFBa0IsTUFBTSxTQUFTO0FBQy9CLGFBQU8sV0FBVyxNQUFNLFlBQVksUUFBUSxhQUFhLEtBQUs7QUFBQTtBQUVoRSxRQUFJLFFBQVE7QUFBQSxNQUNWLEtBQU0sSUFBRyxhQUFhLFNBQVM7QUFBQSxNQUMvQixRQUFTLElBQUcsYUFBYSxTQUFTO0FBQUEsTUFDbEMsS0FBTSxJQUFHLGFBQWEsU0FBUztBQUFBLE1BQy9CLFNBQVUsSUFBRyxhQUFhLFNBQVM7QUFBQSxNQUNuQyxPQUFRLElBQUcsYUFBYSxTQUFTO0FBQUEsTUFDakMsT0FBUSxJQUFHLGFBQWEsU0FBUztBQUFBO0FBRW5DLCtCQUEyQixVQUFVLFNBQVM7QUFDNUMsWUFBTSxPQUFPLFFBQVE7QUFDckIsVUFBSSxPQUFPLFNBQVM7QUFDbEIsZUFBTyxLQUFLO0FBQ2QsaUJBQVcsV0FBVyxRQUFRLFVBQVU7QUFDdEMsWUFBSSxRQUFRLGFBQWEsWUFBWSxNQUFNLGFBQWEsSUFBSTtBQUMxRCxpQkFBTztBQUFBO0FBRVgsYUFBTztBQUFBO0FBRVQsd0JBQW9CLFVBQVU7QUFDNUIsYUFBTyxTQUFTLFFBQVEsY0FBYyxLQUFLLFFBQVEsYUFBYTtBQUFBO0FBRWxFLGlDQUE2QixNQUFNLFNBQVM7QUFDMUMsWUFBTSxVQUFVLFVBQVUsUUFBUSxhQUFhLE1BQU07QUFDckQsWUFBTSxTQUFTLE1BQU0sU0FBUztBQUM5QixZQUFNLFdBQVcsT0FBTyxhQUFhLEtBQUssQ0FBQyxNQUFNLEVBQUUsU0FBUztBQUM1RCxVQUFJLENBQUM7QUFDSCxlQUFPO0FBQ1QsWUFBTSxTQUFTLGlCQUFpQixVQUFVLE1BQU07QUFDaEQsWUFBTSxPQUFPLFVBQVUsTUFBTTtBQUM3QixzQkFBZ0IsSUFBSyxJQUFHLGFBQWEsT0FBTyxPQUFPO0FBQ25ELGFBQU87QUFBQTtBQUVULG1DQUErQixRQUFRO0FBQ3JDLFlBQU0sRUFBRSxnQkFBZ0I7QUFDeEIsWUFBTSxVQUFVLFlBQVksY0FBYztBQUMxQyxVQUFJLFNBQVM7QUFDWCxvQkFBWSxpQkFBaUI7QUFDN0IsZUFBTztBQUFBO0FBRVQsYUFBTztBQUFBO0FBRVQsbUNBQStCLFFBQVE7QUFDckMsWUFBTSxRQUFRLE9BQU8sS0FBSyxRQUFRLElBQUksQ0FBQyxNQUFPLElBQUcsYUFBWSxVQUFVO0FBQ3ZFLGlCQUFXLFNBQVMsT0FBTyxPQUFPLFNBQVM7QUFDekMsY0FBTSxXQUFXLE1BQU0sU0FBUyxRQUFRLFlBQVk7QUFDcEQsWUFBSSxNQUFNLFNBQVMsU0FBUztBQUMxQixxQkFBVyxRQUFRO0FBQ2pCLGtCQUFNLE9BQU8sTUFBTSxLQUFLLFFBQVEsTUFBTSxLQUFLLFFBQVEsWUFBWTtBQUFBO0FBQUE7QUFBQTtBQUl2RSx1Q0FBbUMsVUFBVSxTQUFTO0FBQ3BELFlBQU0sTUFBTTtBQUNaLFlBQU0sZ0JBQWdCLGdCQUFnQixJQUFJO0FBQzFDLFlBQU0sYUFBYSxNQUFNLGNBQWMsVUFBVTtBQUNqRCxZQUFNLElBQUksY0FBYyxVQUFVO0FBQ2xDLFlBQU0sSUFBSSxjQUFjLFVBQVU7QUFDbEMsYUFBTyxDQUFFLElBQUcsa0JBQWtCLFNBQVMsZUFBZTtBQUFBO0FBSXhELFFBQUksY0FBYztBQUNsQixRQUFJLGdCQUFnQjtBQUNwQixRQUFJLHVCQUF1QjtBQUMzQixRQUFJLHNCQUFzQjtBQUMxQiw2QkFBeUIsR0FBRyxPQUFPO0FBQ2pDLFVBQUksaUJBQWlCLFlBQVksT0FBTyxVQUFVLFlBQVk7QUFDNUQsY0FBTSxTQUFTLE1BQU0sV0FBVyxRQUFRLHFCQUFxQixJQUFJLFFBQVEsc0JBQXNCLElBQUksUUFBUSxrQkFBa0I7QUFDN0gsWUFBSSxPQUFPLFNBQVMsS0FBSyxPQUFPLFVBQVUsR0FBRyxPQUFPO0FBQ2xELGlCQUFPLFdBQVc7QUFDcEIsZUFBTztBQUFBO0FBRVQsYUFBTztBQUFBO0FBRVQsNkJBQXlCLGdCQUFnQixTQUFTO0FBQ2hELFlBQU0sVUFBVTtBQUNoQixpQ0FBMkIsS0FBSyxZQUFZLE1BQU07QUFDaEQsY0FBTSxPQUFPLGtCQUFrQixNQUFNO0FBQ3JDLFlBQUksU0FBUyxRQUFRO0FBQ25CLGdCQUFNLGFBQWEsV0FBVztBQUM5QixnQkFBTSxZQUFZLFVBQVUsb0JBQW9CO0FBQ2hELGNBQUksQ0FBQyxRQUFRLFNBQVM7QUFDcEIsb0JBQVEsS0FBSztBQUNmLGlCQUFPLElBQUksUUFBUSxZQUFZO0FBQUEsZUFDMUI7QUFDTCxpQkFBTyxJQUFJLFFBQVEsWUFBWSxpQkFBaUI7QUFBQTtBQUFBO0FBR3BELGdDQUEwQixLQUFLLFlBQVksU0FBUztBQUNsRCxZQUFJLFFBQVEsV0FBVztBQUNyQixpQkFBTyxJQUFJLFFBQVEsWUFBWTtBQUNqQyxZQUFJLFFBQVEsV0FBVztBQUNyQixpQkFBTyxJQUFJLFFBQVEsWUFBWSxRQUFRLE1BQU07QUFDL0MsZUFBTztBQUFBO0FBRVQsWUFBTSxlQUFlLEtBQUssVUFBVSxnQkFBZ0IsaUJBQWlCLFFBQVEsYUFBYSxtQkFBbUIsUUFBUSxlQUFlO0FBQ3BJLGFBQU87QUFBQSxRQUNMO0FBQUEsUUFDQTtBQUFBO0FBQUE7QUFLSixnQ0FBNEIsUUFBUSxTQUFTO0FBQzNDLFlBQU0sRUFBRSxTQUFTLGlCQUFpQixnQkFBZ0IsUUFBUTtBQUMxRCxhQUFPLEdBQUcsUUFBUSxLQUFLO0FBQUE7QUFBQSxpQkFFUjtBQUFBO0FBQUE7QUFBQTtBQUlqQixzQkFBa0IsT0FBTztBQUN2QixhQUFPLENBQUMsR0FBRyxPQUFPLElBQUksQ0FBQyxDQUFDLEdBQUcsV0FBVyxPQUFPLEtBQUssQ0FBQyxHQUFHLE1BQU07QUFDMUQsWUFBSSxFQUFFLFdBQVcsQ0FBQyxFQUFFO0FBQ2xCLGlCQUFPO0FBQ1QsWUFBSSxDQUFDLEVBQUUsV0FBVyxFQUFFO0FBQ2xCLGlCQUFPO0FBQ1QsWUFBSSxTQUFVLEdBQUUsS0FBSyxNQUFNLFVBQVUsSUFBSTtBQUN6QyxZQUFJLFNBQVUsR0FBRSxLQUFLLE1BQU0sVUFBVSxJQUFJO0FBQ3pDLFlBQUksVUFBVSxRQUFRO0FBQ3BCLGlCQUFPLFNBQVM7QUFBQSxlQUNYO0FBQ0wsaUJBQU8sRUFBRSxLQUFLLFNBQVMsRUFBRSxLQUFLO0FBQUE7QUFBQTtBQUFBO0FBSXBDLHdCQUFvQixPQUFPO0FBQ3pCLGFBQU8sTUFBTSxLQUFLLENBQUMsR0FBRyxNQUFNO0FBQzFCLFlBQUksU0FBUyxFQUFFLEtBQUssUUFBUSxZQUFZLElBQUksUUFBUTtBQUNwRCxpQkFBUyxTQUFTLElBQUksTUFBTTtBQUM1QixZQUFJLFNBQVMsRUFBRSxLQUFLLFFBQVEsWUFBWSxJQUFJLFFBQVE7QUFDcEQsaUJBQVMsU0FBUyxJQUFJLE1BQU07QUFDNUIsWUFBSSxTQUFVLEdBQUUsS0FBSyxNQUFNLFVBQVUsSUFBSTtBQUN6QyxZQUFJLFNBQVUsR0FBRSxLQUFLLE1BQU0sVUFBVSxJQUFJO0FBQ3pDLFlBQUksVUFBVSxRQUFRO0FBQ3BCLGlCQUFPLFNBQVM7QUFBQSxlQUNYO0FBQ0wsY0FBSSxVQUFVLFFBQVE7QUFDcEIsbUJBQU8sU0FBUztBQUFBLGlCQUNYO0FBQ0wsbUJBQU8sRUFBRSxLQUFLLFNBQVMsRUFBRSxLQUFLO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFLdEMsMEJBQXNCLE9BQU8sUUFBUSxPQUFPO0FBQzFDLFVBQUk7QUFDSixVQUFJLFdBQVc7QUFDZixVQUFJLENBQUMsUUFBUTtBQUNYLGNBQU0sT0FBTyxNQUFNLE1BQU07QUFDekIsY0FBTSxRQUFRLE1BQU0sTUFBTTtBQUMxQixjQUFNLEtBQUs7QUFDWCxlQUFPO0FBQUE7QUFFVCxlQUFTLFFBQVEsT0FBTztBQUN0QixZQUFLLE1BQUssS0FBSyxVQUFVLE9BQU8sU0FBUyxHQUFHLFNBQVMsU0FBUztBQUM1RCxxQkFBVztBQUNYLGdCQUFNLFFBQVEsS0FBSyxRQUFRLE1BQU07QUFDakMsZUFBSyxXQUFXLEtBQUssWUFBWTtBQUNqQyxlQUFLLFNBQVMsS0FBSztBQUFBO0FBRXJCLFlBQUksS0FBSyxVQUFVO0FBQ2pCLGNBQUksYUFBYSxLQUFLLFVBQVUsUUFBUSxRQUFRO0FBQzlDLHVCQUFXO0FBQUE7QUFBQTtBQUFBO0FBSWpCO0FBQ0EsYUFBTztBQUFBO0FBRVQsMkJBQXVCLE9BQU8sU0FBUyxNQUFNO0FBQzNDLFVBQUk7QUFDSixVQUFJLFNBQVMsSUFBSTtBQUNqQixlQUFTLFFBQVEsT0FBTztBQUN0QixZQUFJLE9BQU8sSUFBSSxLQUFLLE9BQU87QUFDekIsZ0JBQU0sSUFBSSxNQUFNLGdEQUFnRCxLQUFLO0FBQUE7QUFFdkUsZUFBTyxJQUFJLEtBQUs7QUFDaEIsZUFBTyxLQUFLO0FBQ1osWUFBSSxNQUFNO0FBQ1IsZUFBSyxPQUFPLEtBQUssS0FBSyxRQUFRLE9BQU87QUFBQSxlQUNoQztBQUNMLGVBQUssT0FBTyxLQUFLLEtBQUssUUFBUSxPQUFPO0FBQUE7QUFFdkMsWUFBSSxDQUFDLFFBQVEsT0FBTztBQUNsQixlQUFLLFFBQVE7QUFBQSxlQUNSO0FBQ0wsZUFBSyxTQUFTLEtBQUs7QUFDbkIsaUJBQU8sS0FBSztBQUNaLGVBQUssUUFBUTtBQUNiLGlCQUFPLEtBQUs7QUFBQTtBQUVkLFlBQUksS0FBSyxVQUFVO0FBQ2pCLGVBQUssV0FBVyxjQUFjLEtBQUssVUFBVTtBQUFBO0FBRS9DLGVBQU8sT0FBTyxNQUFRLE9BQUssUUFBUSxnQkFBZ0IsT0FBTyxTQUFTLEdBQUcsS0FBSyxTQUFTLFVBQVU7QUFBQTtBQUVoRyxhQUFPLFdBQVc7QUFBQTtBQUVwQiw0QkFBd0IsT0FBTyxTQUFTO0FBQ3RDLFlBQU0sRUFBRSxjQUFjO0FBQ3RCLFVBQUksUUFBUTtBQUNaLFlBQU0sWUFBWSxTQUFTO0FBQzNCLGdCQUFVLFFBQVEsQ0FBQyxTQUFTO0FBQzFCLFlBQUksRUFBRSxNQUFNLE1BQU0sU0FBUyxjQUFjO0FBQ3pDLFlBQUksT0FBTyxZQUFZLFVBQVU7QUFDL0Isb0JBQVUsQ0FBQztBQUFBO0FBRWIsZ0JBQVEsSUFBSSxDQUFDLFdBQVc7QUFDdEIsZ0JBQU0sUUFBUTtBQUFBLFlBQ1o7QUFBQSxZQUNBO0FBQUEsWUFDQSxPQUFPLFNBQVM7QUFBQSxZQUNoQjtBQUFBO0FBRUYsaUJBQU8sT0FBTyxPQUFPO0FBQ3JCLGNBQUksV0FBVyxhQUFhLE9BQU8sUUFBUTtBQUMzQyxjQUFJLENBQUMsVUFBVTtBQUNiLG1CQUFPLEtBQUssUUFBUSxZQUFZO0FBQ2hDLHFCQUFTLE9BQU8sUUFBUSxPQUFPO0FBQy9CLHFCQUFTLE9BQU8sUUFBUSxZQUFZO0FBQ3BDLGtCQUFNLE9BQU8sU0FBUztBQUN0QixrQkFBTSxPQUFPLE1BQU0sU0FBUyxNQUFNLE1BQU0sS0FBSztBQUFBO0FBQUE7QUFBQTtBQUluRCxZQUFNLGNBQWMsY0FBYyxPQUFPLFNBQVM7QUFDbEQsYUFBTztBQUFBO0FBSVQsUUFBSSxnQkFBZSxZQUFXLFVBQVE7QUFHdEMsUUFBSSxtQkFBbUIsWUFBVyxVQUFRO0FBQzFDLHVCQUFtQixTQUFTO0FBQzFCLGFBQU8sQ0FBQyxnQkFBZ0IsUUFBUSxlQUFlLEdBQUc7QUFBQTtBQUVwRCx5QkFBcUIsZ0JBQWdCLE1BQU0sU0FBUztBQUNsRCxZQUFNLE9BQU8saUJBQWlCLFFBQVEsS0FBSyxnQkFBZ0I7QUFBQSxRQUN6RCxRQUFRLFVBQVU7QUFBQSxRQUNsQixpQkFBaUI7QUFBQSxRQUNqQixLQUFLO0FBQUEsUUFDTCxRQUFRO0FBQUEsUUFDUixLQUFLO0FBQUE7QUFFUCxhQUFPO0FBQUE7QUFFVCwwQkFBc0IsTUFBTSxTQUFTO0FBQ25DLFlBQU0sRUFBRSxTQUFTLGVBQWU7QUFDaEMsWUFBTSxNQUFNLGlCQUFpQjtBQUM3QixZQUFNLFFBQVEsaUJBQWlCLFFBQVEsS0FBSyxRQUFRLE9BQU87QUFBQSxRQUN6RCxRQUFRLFVBQVU7QUFBQSxRQUNsQixXQUFXO0FBQUEsUUFDWCxLQUFLO0FBQUE7QUFFUCxhQUFPO0FBQUE7QUFJVCw2QkFBeUIsVUFBVSxNQUFNLFNBQVM7QUFDaEQsaUJBQVksSUFBRyxhQUFhLFNBQVM7QUFDckMsYUFBTyxTQUFTLFFBQVEsQ0FBQyxjQUFjO0FBQ3JDLG9CQUFhLElBQUcsYUFBYSxPQUFRLElBQUcsY0FBYSxTQUFTLE1BQU0sWUFBWSxRQUFRLEdBQUcsU0FBUztBQUNwRyxlQUFPLFlBQVksV0FBVyxNQUFNO0FBQUE7QUFBQTtBQUd4Qyw0QkFBd0IsYUFBYSxVQUFVO0FBQzdDLFlBQU07QUFBQSxRQUNKLFdBQVcsQ0FBQztBQUFBLFFBQ1osaUJBQWlCO0FBQUEsUUFDakIsVUFBVTtBQUFBLFFBQ1YsWUFBWTtBQUFBLFFBQ1osdUJBQXVCLHlCQUF5QjtBQUFBLFFBQ2hELFlBQVk7QUFBQSxRQUNaLFFBQVE7QUFBQSxRQUNSO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxVQUNFO0FBQ0osWUFBTSxPQUFPLFlBQWEsSUFBRyxhQUFhLE9BQU8sUUFBUTtBQUN6RCxZQUFNLGFBQWEsWUFBWSxjQUFlLFNBQVEsU0FBUztBQUMvRCxZQUFNLGFBQWEsWUFBWSxjQUFlLFNBQVEsQ0FBQyxPQUFPLFNBQVMsQ0FBQyxPQUFPLE1BQU07QUFDckYsWUFBTSxlQUFlLElBQUksT0FBTyxPQUFPLFdBQVcsS0FBSztBQUN2RCxZQUFNLG1CQUFtQixnQkFBZ0IsVUFBVSxNQUFNO0FBQ3pELFlBQU0sa0JBQWtCO0FBQUEsUUFDdEIsVUFBVTtBQUFBLFFBQ1Y7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0EsdUJBQXVCO0FBQUEsUUFDdkI7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBO0FBRUYsYUFBTztBQUFBO0FBSVQsUUFBSSxlQUFlLFlBQVcsVUFBUTtBQUN0Qyx5QkFBcUIsTUFBTTtBQUN6QixhQUFPLEtBQUssUUFBUSxvQkFBb0I7QUFDeEMsYUFBTyxLQUFLLFFBQVEsOEJBQThCO0FBQ2xELGFBQU8sS0FBSyxRQUFRLHFCQUFxQjtBQUN6QyxhQUFPLEtBQUssUUFBUSxxQkFBcUI7QUFDekMsYUFBTyxLQUFLLFFBQVEsZ0NBQWdDO0FBQ3BELGFBQU87QUFBQTtBQUVULDJCQUF1QixPQUFPLEtBQUssTUFBTSxTQUFTO0FBQ2hELFVBQUksWUFBYSxJQUFHLGFBQWEsU0FBUyxNQUFNLE1BQU07QUFDdEQsVUFBSSxVQUFXLElBQUcsYUFBYSxTQUFTLE1BQU0sUUFBUSxLQUFLO0FBQzNELFVBQUksV0FBWSxJQUFHLGFBQWEsT0FBUSxJQUFHLGFBQWEsU0FBUyxRQUFRLE1BQU07QUFDL0UsVUFBSSxXQUFZLElBQUcsYUFBYSxVQUFVLE1BQU0sUUFBUSxRQUFRLGNBQWM7QUFDOUUsaUJBQVcsWUFBWTtBQUN2QixnQkFBVSxZQUFZO0FBQ3RCLFVBQUksT0FBTztBQUFBLFFBQ1QsTUFBTSxHQUFHO0FBQUEsUUFDVCxNQUFNLElBQUk7QUFBQSxRQUNWLFNBQVMsR0FBRztBQUFBLFFBQ1osV0FBVyxJQUFJO0FBQUE7QUFFakIsVUFBSSxRQUFRO0FBQ1osVUFBSSxDQUFDLE9BQU8sTUFBTSxTQUFTLFlBQVk7QUFDckMsZ0JBQVEsTUFBTSxjQUFjLFVBQVU7QUFBQTtBQUV4QyxhQUFPLE9BQU8sTUFBTTtBQUNwQixXQUFLLE9BQU8sS0FBSyxLQUFLLFFBQVEsWUFBWTtBQUMxQyxZQUFNLElBQUksTUFBTTtBQUFBO0FBRWxCLGdDQUE0QixTQUFTO0FBQ25DLFlBQU0sT0FBUSxJQUFHLGFBQWEsU0FBUyxRQUFRO0FBQy9DLFlBQU0sUUFBUSxJQUFJO0FBQ2xCLFlBQU0sZUFBZSxLQUFLLElBQUksQ0FBQyxRQUFRO0FBQ3JDLGNBQU0sV0FBWSxJQUFHLGFBQWEsT0FBUSxJQUFHLGFBQWEsU0FBUyxRQUFRLE1BQU07QUFDakYsZUFBTztBQUFBLFVBQ0w7QUFBQSxVQUNBLE9BQU8sYUFBYSxVQUFVO0FBQUE7QUFBQTtBQUdsQyxpQkFBVyxPQUFPLGNBQWM7QUFDOUIsbUJBQVcsUUFBUSxJQUFJLE9BQU87QUFDNUIsZ0JBQU0sUUFBUSxPQUFPLElBQUksS0FBTSxJQUFHLGFBQWEsTUFBTSxJQUFJLEtBQUssT0FBTztBQUFBO0FBQUE7QUFHekUsYUFBTztBQUFBO0FBRVQsMkJBQXVCLE9BQU8sTUFBTSxTQUFTO0FBQzNDLGFBQU8sS0FBSyxRQUFRLFFBQVEsTUFBTTtBQUNsQyxZQUFNLFVBQVUsUUFBUSxTQUFTLEtBQUssQ0FBQyxNQUFNO0FBQzNDLGFBQUssV0FBVyxJQUFJO0FBQUE7QUFFdEIsVUFBSSxDQUFDO0FBQ0g7QUFDRixZQUFNLFFBQVEsT0FBTyxTQUFTLE1BQU07QUFBQTtBQUV0Qyw4QkFBMEIsT0FBTyxNQUFNLFNBQVM7QUFDOUMsWUFBTSxPQUFPLE1BQU0sSUFBSTtBQUN2QixVQUFJLE1BQU07QUFDUixjQUFNLGNBQWMsZ0JBQWdCLElBQUksU0FBUztBQUNqRCxhQUFLLGNBQWM7QUFDbkIsY0FBTSxJQUFJLE1BQU07QUFBQTtBQUVsQixVQUFJLFNBQVMsYUFBYTtBQUN4QixnQkFBUSxJQUFJLFFBQVE7QUFBQTtBQUFBO0FBR3hCLHdCQUFvQixPQUFPLE1BQU07QUFDL0IsWUFBTSxPQUFPO0FBQUE7QUFJZix1QkFBbUIsUUFBUSxPQUFPLFNBQVMsYUFBYTtBQUN0RCxZQUFNLEVBQUUsSUFBSSxZQUFZO0FBQ3hCLDRCQUFzQjtBQUNwQiw4QkFBc0I7QUFDdEI7QUFDQSxXQUFHLEtBQUs7QUFBQSxVQUNOLE1BQU07QUFBQTtBQUFBO0FBR1YsY0FBUSxHQUFHLE9BQU8sT0FBTyxTQUFTO0FBQ2hDLFlBQUksWUFBWSxLQUFLO0FBQ25CO0FBQ0YsY0FBTSxPQUFPLEtBQUssUUFBUSxRQUFRLE1BQU07QUFDeEMsWUFBSSxTQUFTLE1BQU0sVUFBVTtBQUMzQixnQkFBTSxRQUFRLE9BQU8sTUFBTTtBQUMzQixnQkFBTSxJQUFJLE9BQU87QUFDakI7QUFBQTtBQUFBO0FBR0osY0FBUSxHQUFHLFVBQVUsQ0FBQyxTQUFTO0FBQzdCLFlBQUksWUFBWSxLQUFLO0FBQ25CO0FBQ0YsY0FBTSxPQUFPLEtBQUssUUFBUSxRQUFRLE1BQU07QUFDeEMsWUFBSSxTQUFTLE1BQU0sVUFBVTtBQUMzQixxQkFBVyxPQUFPO0FBQ2xCLGdCQUFNLElBQUksVUFBVTtBQUNwQjtBQUFBO0FBQUE7QUFHSixjQUFRLEdBQUcsVUFBVSxPQUFPLFNBQVM7QUFDbkMsWUFBSSxZQUFZLEtBQUs7QUFDbkI7QUFDRixjQUFNLE9BQU8sS0FBSyxRQUFRLFFBQVEsTUFBTTtBQUN4QyxZQUFJLFNBQVMsTUFBTSxZQUFZLENBQUMsUUFBUSxPQUFPO0FBQzdDLGdCQUFNLGFBQWEsTUFBTSxvQkFBb0IsTUFBTTtBQUNuRCxjQUFJLFlBQVk7QUFDZCx1QkFBVyxPQUFPLE1BQU07QUFDeEIsa0JBQU0sSUFBSSxVQUFVO0FBQ3BCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFPUix5QkFBcUIsY0FBYyxJQUFJO0FBQ3JDLFVBQUksa0JBQWtCO0FBQ3RCLFVBQUk7QUFDSixVQUFJO0FBQ0osYUFBTztBQUFBLFFBQ0wsTUFBTTtBQUFBLFFBQ04sU0FBUztBQUFBLGNBQ0gsVUFBVSxPQUFPLElBQUk7QUFDekIsY0FBSSxDQUFDLGlCQUFpQixLQUFLO0FBQ3pCO0FBQ0YsaUJBQU87QUFBQSxZQUNMLE1BQU07QUFBQSxZQUNOLEtBQUs7QUFBQTtBQUFBO0FBQUEsUUFHVCxlQUFlLFVBQVUsUUFBUTtBQUMvQixjQUFJLFFBQVE7QUFDVixrQ0FBc0I7QUFBQTtBQUFBLFFBRTFCLGdCQUFnQixRQUFRO0FBQ3RCLG9CQUFVLFFBQVEsT0FBTyxTQUFTLE1BQU07QUFDdEMsOEJBQWtCO0FBQUE7QUFBQTtBQUFBLGNBR2hCLGVBQWUsRUFBRSxRQUFRO0FBQzdCLG9CQUFVLGVBQWUsYUFBYTtBQUN0QyxrQkFBUSxNQUFNLGFBQWE7QUFDM0IsZ0JBQU0sUUFBUTtBQUNkLGdCQUFNLE1BQU07QUFBQTtBQUFBLGNBRVIsS0FBSyxJQUFJO0FBQ2IsY0FBSSxJQUFJO0FBQ1IsY0FBSSxPQUFPO0FBQ1Q7QUFDRixjQUFJLENBQUMsaUJBQWlCO0FBQ3BCLDhCQUFrQjtBQUNsQixnQkFBSTtBQUNGLGdDQUFrQixlQUFlLE9BQU87QUFBQSxxQkFDakMsS0FBUDtBQUNBLHNCQUFRLE1BQU07QUFBQTtBQUVoQiw4QkFBa0IsTUFBUSxPQUFLLFFBQVEsc0JBQXNCLE9BQU8sU0FBUyxHQUFHLEtBQUssU0FBUyxxQkFBcUI7QUFBQTtBQUVySCxnQkFBTSxJQUFJLGNBQWM7QUFDeEIsY0FBSSxhQUFhLG1CQUFtQixpQkFBaUI7QUFDckQsdUJBQWEsTUFBUSxPQUFLLFFBQVEsc0JBQXNCLE9BQU8sU0FBUyxHQUFHLEtBQUssU0FBUyxnQkFBZ0I7QUFDekcsZ0JBQU0sSUFBSSxtQkFBbUI7QUFDN0IsaUJBQU87QUFBQTtBQUFBLFFBRVQsVUFBVSxJQUFJO0FBQ1osaUJBQU8sR0FBRyxXQUFXLHFCQUFxQixvQkFBb0I7QUFBQTtBQUFBO0FBQUE7QUFJcEUsUUFBSSxjQUFjO0FBQUE7QUFBQTs7O0FDbGtCbEIsa0JBQWlCO0FBSGpCO0FBQ0E7QUFDQTtBQUVBO0FBQ0EsSUFBTSxTQUFTLGFBQWE7QUFBQSxFQUN4QixTQUFTO0FBQUEsSUFDTCxJQUFJO0FBQUEsTUFDQSxTQUFTLENBQUMsVUFBVTtBQUFBO0FBQUEsSUFFeEIseUJBQUs7QUFBQSxNQUVELFVBQVU7QUFBQSxRQUNOO0FBQUEsUUFDQTtBQUFBLFFBQ0EsUUFBUSxzRUFBc0U7QUFBQTtBQUFBLE1BRWxGLFlBQVksQ0FBQyxPQUFPO0FBQUEsTUFDcEIsV0FBVztBQUFBLE1BQ1gsdUJBQXVCO0FBQUEsTUFDdkIsWUFBWSxPQUFXO0FBQ25CLFlBQUksTUFBTSxTQUFTLFNBQVM7QUFDeEIsZ0JBQU0sUUFBUSxDQUFDLFdBQWU7QUFBQSxZQUMxQixPQUFPLE9BQU0sTUFBTTtBQUFBO0FBQUE7QUFHM0IsWUFBSSxNQUFNLFNBQVMsY0FBYztBQUM3QixpQkFBTyxpQ0FDQSxRQURBO0FBQUEsWUFFSCxhQUFhLENBQUMsV0FBZTtBQUV6QixzQkFBUSxJQUFJO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBTWhDO0FBQUE7QUFBQTtBQUlSLElBQU8sc0JBQVE7IiwKICAibmFtZXMiOiBbXQp9Cg==
