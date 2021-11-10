import fg from "fast-glob";
import {  ResolvedOptions } from "./types";
import { extensionsToGlob } from "./utils";

function getIgnore(exclude: string[]) {
    return ["node_modules", ".git", "**/__*__/**", ...exclude];
}

/**
 * Resolves the page dirs for its for its given globs
 */
export function getPageDirs(pageDirOptions: string, root: string, exclude: string[]): string[] {
    const dirs = fg.sync(pageDirOptions, {
        ignore: getIgnore(exclude),
        onlyDirectories: true,
        dot: true,
        unique: true,
        cwd: root,
    });

    return dirs;
}

/**
 * Resolves the files that are valid pages for the given context.
 */
export function getPageFiles(path: string, options: ResolvedOptions): string[] {
    const { exclude, extensions } = options;

    const ext = extensionsToGlob(extensions);

    const files = fg.sync(`**/*.${ext}`, {
        ignore: getIgnore(exclude),
        onlyFiles: true,
        cwd: path,
    });

    return files;
}
