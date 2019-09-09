import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestApiService } from '../services/rest-api.service';

@Component({
    selector: 'frequency-grid',
    template: `
    <select style="margin-left: 5px; margin-bottom: 10px;" class="ag-theme-balham">
        <option [value]="Datasource" *ngFor="let source of Datasource">{{source.datasource}}</option>
    </select>
    
    <select style="margin-left: 10px; margin-bottom: 10px;" class="ag-theme-balham">
        <option [value]="variable" *ngFor="let variable of Variables">{{variable.variable}}</option>
    </select>

  <ag-grid-angular 
    style="width: 640px; height: 500px;" 
    class="ag-theme-balham"
    [rowData]="rowData | async"
    [enableRangeSelection]="true"
    [enableCharts]="true"
    [allowContextMenuWithControlKey]="true"
    [columnDefs]="columnDefs">
  </ag-grid-angular>
  `,
    styleUrls: ['grid.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class GridComponent implements OnInit {

    columnDefs = [
        { headerName: 'County', field: 'variableCodes', sortable: true, filter: true },
        { headerName: 'Frequency', field: 'frequency1', sortable: true, filter: true },
        { headerName: 'Cum Frequency', field: 'frequency2', sortable: true, filter: true },
        { headerName: 'Percent', field: 'percent1', sortable: true, filter: true },
        { headerName: 'Cum Percent', field: 'cumulativePercent1', sortable: true, filter: true },
    ];

    Datasource: any = [];
    Variables: any = [];
    rowData: any;

    constructor(private http: HttpClient, public restApi: RestApiService) { }

    ngOnInit() {
        this.rowData = this.http.get('http://dev.itis-app.com/care-rest/api/v1/frequency-analysis?datasource=IXNS_2008-2019&filterName=County%5C%5CLaramie&suppressNulls=true&variableName=C001%3A%20County');
        this.loadDataSources();
    }

    // Get links list
    loadDataSources() {
        return this.restApi.getDataSources().subscribe((data: {}) => {
            this.Datasource = data;
        });
    }

    getVariables(datasource) {
        return this.restApi.getVariables(datasource).subscribe((data: {}) => {
            this.Variables = data;
        });
    }

}