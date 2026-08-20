import { GeneratorConfig } from "ng-openapi";

const config: GeneratorConfig = {
    input: "./docs/furrify-attachments.json",
    output: "../generated/attachments",
    options: {
        dateType: "Date",
        enumStyle: "enum",
    },
};

export default config;
