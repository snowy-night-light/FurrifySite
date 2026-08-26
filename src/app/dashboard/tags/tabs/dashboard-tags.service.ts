import {inject, Injectable} from '@angular/core';
import {CrudDataSet} from '../../../../store/common/crud/crud-data-set';
import {CrudDataSource} from '../../../../store/common/crud/crud-data-source';
import {UiToastService} from '../../../../ui/core/service/ui-toast.service';
import {
    TagV1RestControllerService,
    TagCategoryV1RestControllerService,
    TagAliasV1RestControllerService,
    TagDTO, PatchTagRequest, CreateTagRequest
} from '../../../../openapi/generated/storage';
import {SpecConnector, SpecOperator} from '../../../../store/common/specification';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DashboardTagsService {
    private readonly toastService = inject(UiToastService);
    private readonly tagV1RestControllerService = inject(TagV1RestControllerService);
    private readonly tagCategoryV1RestControllerService = inject(TagCategoryV1RestControllerService);
    private readonly tagAliasV1RestControllerService = inject(TagAliasV1RestControllerService);

    readonly tagsDataSet = new CrudDataSet(new CrudDataSource(this.tagV1RestControllerService));
    readonly categoriesDataSet = new CrudDataSet(new CrudDataSource(this.tagCategoryV1RestControllerService));
    readonly aliasesDataSet = new CrudDataSet(new CrudDataSource(this.tagAliasV1RestControllerService));

    fetchTags(query: string, libraryId: string) {
        this.tagsDataSet.setSpecification({
            connector: SpecConnector.AND,
            conditions: [
                {
                    connector: SpecConnector.OR,
                    conditions: [
                        {
                            field: 'library.id',
                            operator: SpecOperator.EQUALS,
                            value: libraryId
                        },
                        {
                            field: 'library',
                            operator: SpecOperator.EQUALS,
                            value: null
                        }
                    ]
                },
                {
                    field: 'name',
                    operator: SpecOperator.LIKE_IGNORE_CASE,
                    value: `%${query}%`
                }
            ]
        });
        this.tagsDataSet.fetch().subscribe();
    }

    fetchCategories(query: string, libraryId: string) {
        this.categoriesDataSet.setSpecification({
            connector: SpecConnector.AND,
            conditions: [
                {
                    connector: SpecConnector.OR,
                    conditions: [
                        {
                            field: 'library.id',
                            operator: SpecOperator.EQUALS,
                            value: libraryId
                        },
                        {
                            field: 'library',
                            operator: SpecOperator.EQUALS,
                            value: null
                        }
                    ]
                },
                {
                    field: 'name',
                    operator: SpecOperator.LIKE_IGNORE_CASE,
                    value: `%${query}%`
                }
            ]
        });
        this.categoriesDataSet.fetch().subscribe();
    }

    fetchAliases(query: string, libraryId: string) {
        this.aliasesDataSet.setSpecification({
            connector: SpecConnector.AND,
            conditions: [
                {
                    connector: SpecConnector.OR,
                    conditions: [
                        {
                            field: 'targetTag.library.id',
                            operator: SpecOperator.EQUALS,
                            value: libraryId
                        },
                        {
                            field: 'targetTag.library',
                            operator: SpecOperator.EQUALS,
                            value: null
                        }
                    ]
                },
                {
                    field: 'alias',
                    operator: SpecOperator.LIKE_IGNORE_CASE,
                    value: `%${query}%`
                }
            ]
        });
        this.aliasesDataSet.fetch().subscribe();
    }

    createTag(dto: TagDTO): Observable<TagDTO> {
        const request: CreateTagRequest = {
            name: dto.name,
            library: {
                id: dto.library?.id
            },
            category: {
                id: dto.category?.id
            }
        };

        return this.tagsDataSet.create(request);
    }

    updateTag(dto: TagDTO): Observable<TagDTO> {
        const request: PatchTagRequest = {
            name: dto.name,
            library: {
                id: dto.library?.id
            },
            category: {
                id: dto.category?.id
            }
        };

        if (dto.id) {
            return this.tagsDataSet.updateById(dto.id, request);
        } else {
            throw Error('Cannot update tag without id');
        }
    }
}
