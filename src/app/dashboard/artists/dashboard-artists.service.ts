import {inject, Injectable} from '@angular/core';
import {CrudDataSet} from '../../../store/common/crud/crud-data-set';
import {CrudDataSource} from '../../../store/common/crud/crud-data-source';
import {UiToastService} from '../../../ui/core/service/ui-toast.service';
import {
    ArtistV1RestControllerService,
    MediaV1RestControllerService,
    ArtistDTO, CreateArtistRequest, PatchArtistRequest
} from '../../../openapi/generated/storage';
import {
    AttachmentFileV1RestControllerService
} from '../../../openapi/generated/attachment';
import {SpecConnector, SpecOperator} from '../../../store/common/specification';
import {Observable, from, firstValueFrom} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DashboardArtistsService {
    private readonly artistV1RestControllerService = inject(ArtistV1RestControllerService);
    private readonly attachmentService = inject(AttachmentFileV1RestControllerService);
    private readonly mediaService = inject(MediaV1RestControllerService);

    readonly artistsDataSet = new CrudDataSet(new CrudDataSource(this.artistV1RestControllerService));
    readonly attachmentDataSet = new CrudDataSet(new CrudDataSource(this.attachmentService));
    readonly mediaDataSet = new CrudDataSet(new CrudDataSource(this.mediaService));

    // Cache File instances to their created media IDs to skip re-uploading if creation fails later
    private readonly attachmentCache = new Map<File, string>();
    private readonly avatarCache = new Map<File, string>();

    fetchArtists(query: string, libraryId: string) {
        this.artistsDataSet.setSpecification({
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
                    field: 'nicknames.nickname',
                    operator: SpecOperator.LIKE_IGNORE_CASE,
                    value: `%${query}%`
                }
            ]
        });
        this.artistsDataSet.fetch().subscribe();
    }

    private async processAvatar(dto: ArtistDTO & { _avatarFile?: File }): Promise<string | undefined> {
        if (!dto._avatarFile) return dto.avatar?.id;

        const file = dto._avatarFile as File;
        if (this.avatarCache.has(file)) {
            return this.avatarCache.get(file);
        }

        try {
            let attachmentId = this.attachmentCache.get(file);

            if (!attachmentId) {
                const formData = new FormData();
                formData.append('fileName', file.name);
                formData.append('file', file);

                const attachment = await firstValueFrom(this.attachmentDataSet.create(formData as any));

                attachmentId = attachment.id!;
                this.attachmentCache.set(file, attachmentId);
            }

            const media = await firstValueFrom(this.mediaDataSet.create({
                priority: 0,
                fileReferenceId: attachmentId
            }));

            this.avatarCache.set(file, media.id!);
            return media.id;
        } catch (e) {
            console.error("Failed to process avatar", e);
            throw e;
        }
    }

    createArtist(dto: ArtistDTO): Observable<ArtistDTO> {
        return from(this.processAvatar(dto).then(avatarId => {
            const request: CreateArtistRequest = {
                nicknames: dto.nicknames || [],
                avatar: avatarId ? { id: avatarId } : undefined,
                library: {
                    id: dto.library?.id
                }
            };
            return firstValueFrom(this.artistsDataSet.create(request));
        }));
    }

    updateArtist(dto: ArtistDTO): Observable<ArtistDTO> {
        return from(this.processAvatar(dto).then(avatarId => {
            const request: PatchArtistRequest = {
                nicknames: dto.nicknames,
                avatar: avatarId ? { id: avatarId } : undefined,
            };

            if (dto.id) {
                return firstValueFrom(this.artistsDataSet.updateById(dto.id, request));
            } else {
                throw Error('Cannot update artist without id');
            }
        }));
    }

    deleteArtist(id: string): Observable<void> {
        return this.artistsDataSet.deleteById(id);
    }
}

