export enum SpecOperator {
    EQUALS = "=", NOT_EQUALS = "!=", GREATER = ">", GREATER_EQUALS = ">=", LESSER = "<", LESSER_EQUALS = "<=", EQUALS_IGNORE_CASE = "=^", NOT_EQUALS_IGNORE_CASE = "!=^"
}

export enum SpecConnector {
    AND = "&&", OR = "||"
}

export interface SpecCondition {
    field: string;
    operator: SpecOperator;
    value: string | number | boolean;
}

export interface SpecGroup {
    connector: SpecConnector;
    conditions: EntitySpecification[];
}

export type EntitySpecification = SpecCondition | SpecGroup;

const isSpecGroup = (spec: EntitySpecification): spec is SpecGroup => {
    return "connector" in spec && "conditions" in spec;
};

export const buildSpecString = (spec: EntitySpecification): string | undefined => {
    if (!spec) {
        return undefined;
    }
    if (isSpecGroup(spec)) {
        if (spec.conditions.length === 0) {
            return undefined;
        }

        const groupString = spec.conditions
            .map((condition) => buildSpecString(condition))
            .filter((str) => str !== undefined)
            .join(` ${spec.connector} `);

        return spec.conditions.length > 1 ? `(${groupString})` : groupString;
    } else {
        return `(${spec.field} ${spec.operator} ${spec.value})`;
    }
};
