import {Component, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

export interface TabItem {
    labelKey: string;
    route: string | any[];
    queryParams?: any;
}

@Component({
    selector: 'ui-tabs',
    imports: [CommonModule, RouterModule, TranslatePipe],
    templateUrl: './tabs.component.html'
})
export class TabsComponent {
    tabs = input.required<TabItem[]>();
}
