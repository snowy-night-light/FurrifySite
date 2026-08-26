import {InputSignal} from '@angular/core';

export interface ModalComponent<RETURN_TYPE> {
    data: InputSignal<{ data: RETURN_TYPE }>;
    isValid?: boolean;
    onSaveReturnValue?: () => RETURN_TYPE
}
