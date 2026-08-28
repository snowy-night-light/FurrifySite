import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { DynamicDropdownComponent } from './dynamic-dropdown.component';
import { InputFieldComponent } from '../input-field/input-field.component';
import { provideTranslateService } from '@ngx-translate/core';

@Component({
  template: `
    <ui-dynamic-dropdown [dataset]="dataset" [searchGroup]="[]" [mapDisplayItem]="mapFn">
      <ui-input-field type="text"></ui-input-field>
    </ui-dynamic-dropdown>
  `,
  imports: [DynamicDropdownComponent, InputFieldComponent]
})
class TestHostComponent {
  dataset = { getIsFetchingSignal: () => () => false, getPageSignal: () => () => null, getPageableSignal: () => () => null } as any;
  mapFn = (dto: any) => ({ text: '', value: dto });
}

describe('DynamicDropdown', () => {
    let component: TestHostComponent;
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
            providers: [provideTranslateService()]
        }).compileComponents();

        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
