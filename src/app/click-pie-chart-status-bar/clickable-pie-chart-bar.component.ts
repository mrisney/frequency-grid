import {Component} from '@angular/core';
import {IAfterGuiAttachedParams, IDoesFilterPassParams, RowNode, IStatusPanel, IStatusPanelParams} from "ag-grid-community";
import {IFilterAngularComp} from 'ag-grid-angular';

@Component({
    selector: 'status-component',
    template: `
        <div style="margin-top: 10px" class="container" *ngIf="visible">
            <div>
                <span class="component">Pie Chart<input type="button" (click)="onClick()" value="open"/></span>
            </div>
        </div>
    `
})
export class ClickablePieChartStatusBarComponent {
    private params: IStatusPanelParams;
    public visible = true;

    agInit(params: IStatusPanelParams): void {
        this.params = params;
    }

    onClick() : void {
        alert('Selected Row Count: ' + this.params.api.getSelectedRows().length);
    }

    setVisible(visible: boolean) {
        this.visible = visible;
    }

    isVisible(): boolean {
        return this.visible;
    }
}

