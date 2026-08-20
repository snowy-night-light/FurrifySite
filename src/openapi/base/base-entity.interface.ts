export interface BaseEntity {
    id?: string;
    version?: number;
    modifiedBy?: string;
    modifiedAt?: Date;
    createdBy?: string;
    createdAt?: Date;
}
