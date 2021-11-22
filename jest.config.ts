import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/test/**/*.spec.[jt]s?(x)"],
};

export default config;
