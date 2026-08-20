import {BaseEntity} from './base-entity.interface';

export interface Page<DTO extends BaseEntity> {
    content?: DTO[];
    page?: {
        size?: number;
        number?: number;
        totalElements?: number;
        totalPages?: number;
    };
}
