import {SchemaPath, validate} from '@angular/forms/signals';

export function dependsOnField(
    path: SchemaPath<any, any, any>,
    dependsOnPath: SchemaPath<any, any, any>,
    options: { message: string }
) {
    validate(path, (ctx) => {
        if (!ctx.valueOf(dependsOnPath)) {
            return { kind: 'required', message: options.message } as any;
        }
        return null;
    });
}
