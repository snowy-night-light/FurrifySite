import type { IPluginGenerator, PluginGeneratorContext } from "ng-openapi";
import { InterfaceDeclaration, ClassDeclaration, SourceFile } from "ts-morph";

export class ImplementsInterfacesPlugin implements IPluginGenerator {
    private context: PluginGeneratorContext;

    constructor(context: PluginGeneratorContext) {
        this.context = context;
    }

    async generate() {
        const project = this.context.project;

        for (const sourceFile of project.getSourceFiles()) {
            if (sourceFile.getFilePath().includes('/models/')) {
                for (const iface of sourceFile.getInterfaces()) {
                    this.processDto(iface, sourceFile);
                    this.processPage(iface, sourceFile);
                    this.processRequests(iface, sourceFile);
                }
            }

            if (sourceFile.getFilePath().includes('/services/')) {
                for (const cls of sourceFile.getClasses()) {
                    this.processService(cls, sourceFile);
                }
            }
        }

        await project.save();
    }

    private processDto(iface: InterfaceDeclaration, sourceFile: SourceFile) {
        const properties = iface.getProperties().map(p => p.getName());

        const hasBaseEntityProps = ['id', 'version', 'modifiedBy', 'modifiedAt', 'createdBy', 'createdAt']
            .every(prop => properties.includes(prop));

        const hasUserScopeProps = hasBaseEntityProps && properties.includes('ownerId');

        if (hasUserScopeProps) {
            this.addImportIfNotExists(sourceFile, 'UserScopeEntity', '../../../base/user-scope-entity.interface');
            if (!iface.getExtends().find(e => e.getText().includes('UserScopeEntity'))) {
                iface.addExtends('UserScopeEntity');
            }
        } else if (hasBaseEntityProps) {
            this.addImportIfNotExists(sourceFile, 'BaseEntity', '../../../base/base-entity.interface');
            if (!iface.getExtends().find(e => e.getText().includes('BaseEntity'))) {
                iface.addExtends('BaseEntity');
            }
        }
    }

    private processPage(iface: InterfaceDeclaration, sourceFile: SourceFile) {
        const properties = iface.getProperties().map(p => p.getName());
        if (properties.includes('content') && properties.includes('page')) {
            const contentProp = iface.getProperty('content');
            const typeText = contentProp?.getTypeNode()?.getText();

            let dtoType = 'BaseEntity';
            if (typeText && typeText.startsWith('Array<') && typeText.endsWith('>')) {
                dtoType = typeText.substring(6, typeText.length - 1);
            } else if (typeText && typeText.endsWith('[]')) {
                dtoType = typeText.substring(0, typeText.length - 2);
            }

            this.addImportIfNotExists(sourceFile, 'Page', '../../../base/page.interface');
            if (!iface.getExtends().find(e => e.getText().includes('Page<'))) {
                iface.addExtends(`Page<${dtoType}>`);
            }
        }
    }

    private processRequests(iface: InterfaceDeclaration, sourceFile: SourceFile) {
        const name = iface.getName();
        if (name.startsWith('Patch') && name.endsWith('Request')) {
            this.addImportIfNotExists(sourceFile, 'PatchRequest', '../../../base/patch-request.interface');
            if (!iface.getExtends().find(e => e.getText().includes('PatchRequest'))) {
                iface.addExtends('PatchRequest');
            }
        }
        if (name.startsWith('Create') && name.endsWith('Request')) {
            this.addImportIfNotExists(sourceFile, 'CreateRequest', '../../../base/create-request.interface');
            if (!iface.getExtends().find(e => e.getText().includes('CreateRequest'))) {
                iface.addExtends('CreateRequest');
            }
        }
    }

    private processService(cls: ClassDeclaration, sourceFile: SourceFile) {
        const methods = cls.getMethods().map(m => m.getName());
        const requiredMethods = ['getAllPaged', 'save', 'getById', 'patch', 'delete'];

        const hasAll = requiredMethods.every(req => methods.some(m => m.endsWith(req.charAt(0).toUpperCase() + req.slice(1)) || m === req));

        if (hasAll) {
            const saveMethodBase = cls.getMethods().find(m => m.getName().endsWith('Save') || m.getName() === 'save');
            const patchMethodBase = cls.getMethods().find(m => m.getName().endsWith('Patch') || m.getName() === 'patch');
            const getByIdMethodBase = cls.getMethods().find(m => m.getName().endsWith('GetById') || m.getName() === 'getById');

            const saveMethod = saveMethodBase?.getOverloads()[0] || saveMethodBase;
            const patchMethod = patchMethodBase?.getOverloads()[0] || patchMethodBase;
            const getByIdMethod = getByIdMethodBase?.getOverloads()[0] || getByIdMethodBase;

            let createReqType = 'any';
            let patchReqType = 'any';
            let dtoType = 'any';

            if (saveMethod) {
                const reqParam = saveMethod.getParameters().find(p => p.getName() !== 'observe' && p.getName() !== 'options' && !p.getTypeNode()?.getText().includes('string'));
                if (reqParam) createReqType = reqParam.getTypeNode()?.getText() || 'any';
            }
            if (patchMethod) {
                const reqParam = patchMethod.getParameters().find(p => p.getName() !== 'observe' && p.getName() !== 'options' && p.getName() !== 'id' && !p.getTypeNode()?.getText().includes('string'));
                if (reqParam) patchReqType = reqParam.getTypeNode()?.getText() || 'any';
            }
            if (getByIdMethod) {
                const returnType = getByIdMethod.getReturnTypeNode()?.getText();
                if (returnType && returnType.startsWith('Observable<') && returnType.endsWith('>')) {
                    dtoType = returnType.substring(11, returnType.length - 1);
                }
            }

            this.addImportIfNotExists(sourceFile, 'PagedRestService', '../../../base/paged-rest-service.interface');
            if (!cls.getImplements().find(e => e.getText().includes('PagedRestService<'))) {
                cls.addImplements(`PagedRestService<${dtoType}, ${createReqType}, ${patchReqType}>`);
            }
        }
    }

    private addImportIfNotExists(sourceFile: SourceFile, namedImport: string, moduleSpecifier: string) {
        const hasImport = sourceFile.getImportDeclarations().some(
            d => d.getModuleSpecifierValue() === moduleSpecifier && d.getNamedImports().some(ni => ni.getName() === namedImport)
        );
        if (!hasImport) {
            sourceFile.addImportDeclaration({
                moduleSpecifier,
                namedImports: [namedImport]
            });
        }
    }
}
