import {Component, input, signal, OnInit, computed, inject} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {ModalComponent} from '../../../../ui/core/interface/modal-component.interface';
import {ArtistDTO, ArtistNickname} from '../../../../openapi/generated/storage';
import {InputFieldComponent} from '../../../../ui/input-field/input-field.component';
import {LabelComponent} from '../../../../ui/label/label.component';
import {form, FormField, required, pattern, maxLength} from '@angular/forms/signals';
import {TranslatePipe} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {ItemListFormComponent} from '../../../../ui/item-list-form/item-list-form.component';
import {environment} from '../../../../environments/environment';
import {AsyncPipe} from '@angular/common';
import {DashboardArtistsService} from '../dashboard-artists.service';

export interface EditArtistFormModel {
    primaryNickname: string;
}

@Component({
    selector: 'app-dashboard-artist-edit',
    imports: [
        InputFieldComponent,
        LabelComponent,
        FormField,
        TranslatePipe,
        FormsModule,
        ItemListFormComponent,
        NgOptimizedImage,
        AsyncPipe
    ],
    templateUrl: './dashboard-artist-edit.component.html',
    styleUrl: './dashboard-artist-edit.component.css',
})
export class DashboardArtistEditComponent implements ModalComponent<ArtistDTO>, OnInit {
    private readonly translatePipe = new TranslatePipe();

    data = input<{ data: ArtistDTO }>({data: {}});

    artistModel = signal<EditArtistFormModel>({
        primaryNickname: ''
    });

    otherNicknames = signal<string[]>([]);

    readonly nicknamePattern = '^[A-Za-z0-9._-]+(?: [A-Za-z0-9._-]+)*$';
    readonly nicknameMaxLength = 256;

    additionalNicknamesValidators = [
        (value: string) => {
            if (value && value.trim().length > this.nicknameMaxLength) {
                return { message: this.translatePipe.transform('app.dashboard.artists.editArtistModal.errors.tooLongNickname') };
            }
            return null;
        },
        (value: string) => {
            const regex = new RegExp(this.nicknamePattern);
            if (value && value.trim() !== '' && !regex.test(value.trim())) {
                return { message: this.translatePipe.transform('app.dashboard.artists.editArtistModal.errors.invalidNicknameFormat') };
            }
            return null;
        }
    ];

    artistForm = form(this.artistModel, (schemaPath) => {
        required(schemaPath.primaryNickname, {message: this.translatePipe.transform('app.dashboard.artists.editArtistModal.errors.requiredNickname')});
        maxLength(schemaPath.primaryNickname, this.nicknameMaxLength, {message: this.translatePipe.transform('app.dashboard.artists.editArtistModal.errors.tooLongNickname')});
        pattern(schemaPath.primaryNickname, new RegExp(this.nicknamePattern), {message: this.translatePipe.transform('app.dashboard.artists.editArtistModal.errors.invalidNicknameFormat')});
    });

    ngOnInit() {
        const inputData = this.data();
        if (inputData?.data) {
            const nicknames = inputData.data.nicknames || [];

            if (nicknames.length > 0) {
                const sorted = [...nicknames].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
                this.artistModel.set({
                    primaryNickname: sorted[0].nickname
                });
                this.otherNicknames.set(sorted.slice(1).map(n => n.nickname));
            } else {
                this.artistModel.set({
                    primaryNickname: ''
                });
                this.otherNicknames.set([]);
            }
        }
    }

    get isValid(): boolean {
        return this.artistForm().valid();
    }

    avatarFile = signal<File | null>(null);
    avatarPreviewUrl = computed(() => {
        const file = this.avatarFile();
        return file ? URL.createObjectURL(file) : null;
    });

    onAvatarSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.avatarFile.set(input.files[0]);
        } else {
            this.avatarFile.set(null);
        }
    }

    onSaveReturnValue(): ArtistDTO {
        const primary: ArtistNickname = {
            nickname: this.artistModel().primaryNickname,
            priority: 10
        };

        const others: ArtistNickname[] = this.otherNicknames().map(nick => ({
            nickname: nick,
            priority: 0
        }));

        return {
            ...this.data().data,
            nicknames: [primary, ...others],
            _avatarFile: this.avatarFile()
        } as ArtistDTO & { _avatarFile?: File | null };
    }

    protected readonly dashboardArtistsService = inject(DashboardArtistsService);

    protected readonly environment = environment;
}
