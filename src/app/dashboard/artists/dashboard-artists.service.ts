import {inject, Injectable} from '@angular/core';
import {CrudDataSet} from '../../../store/common/crud/crud-data-set';
import {CrudDataSource} from '../../../store/common/crud/crud-data-source';
import {UiToastService} from '../../../ui/core/service/ui-toast.service';
import {
    ArtistV1RestControllerService,
    ArtistDTO, CreateArtistRequest, PatchArtistRequest
} from '../../../openapi/generated/storage';
import {SpecConnector, SpecOperator} from '../../../store/common/specification';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DashboardArtistsService {
    private readonly toastService = inject(UiToastService);
    private readonly artistV1RestControllerService = inject(ArtistV1RestControllerService);

    readonly artistsDataSet = new CrudDataSet(new CrudDataSource(this.artistV1RestControllerService));

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

    createArtist(dto: ArtistDTO): Observable<ArtistDTO> {
        const request: CreateArtistRequest = {
            nicknames: dto.nicknames || [],
            library: {
                id: dto.library?.id
            }
        };

        return this.artistsDataSet.create(request);
    }

    updateArtist(dto: ArtistDTO): Observable<ArtistDTO> {
        const request: PatchArtistRequest = {
            nicknames: dto.nicknames
        };

        if (dto.id) {
            return this.artistsDataSet.updateById(dto.id, request);
        } else {
            throw Error('Cannot update artist without id');
        }
    }
}
