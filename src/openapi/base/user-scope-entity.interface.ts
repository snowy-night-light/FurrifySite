import {BaseEntity} from './base-entity.interface';

export interface UserScopeEntity extends BaseEntity {
    ownerId?: string;
}
