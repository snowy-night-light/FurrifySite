import { GeneratorConfig } from "ng-openapi";

const config: GeneratorConfig = {
    input: "./docs/furrify-storage.json",
    output: "../generated/storage",
    clientName: "Storage",
    options: {
        dateType: "Date",
        enumStyle: "enum",
    },
};

export default config;
