import { GeneratorConfig } from "ng-openapi";
// @ts-ignore
import { ImplementsInterfacesPlugin } from "../plugins/implements-interfaces.plugin.ts";

const config: GeneratorConfig = {
    input: "./docs/furrify-attachments.json",
    output: "../generated/attachments",
    clientName: "Attachments",
    options: {
        dateType: "Date",
        enumStyle: "enum",
    },
    plugins: [ImplementsInterfacesPlugin],
};

export default config;
