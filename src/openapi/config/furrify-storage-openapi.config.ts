import { GeneratorConfig } from "ng-openapi";

const storageConfig: GeneratorConfig = {
    input: "./docs/furrify-storage.json",
    output: "../generated",
    options: {
        dateType: "Date",
        enumStyle: "enum",
    },
};

export default storageConfig;
