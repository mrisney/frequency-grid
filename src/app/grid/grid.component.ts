import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestApiService } from '../services/rest-api.service';

@Component({
    selector: 'frequency-grid',
    template: `
    <select style="margin-left: 5px; margin-bottom: 10px;" class="ag-theme-balham" (change)="onDataSourceChange($event.target.value)">
        <option *ngFor="let item of datasources" value={{item.datasource}}>{{item.datasource}}</option>
    </select>

    <select style="margin-left: 10px; margin-bottom: 10px;" class="ag-theme-balham">
        <option *ngFor="let item of variables" value={{item.variable}}>{{item.variable}}</option>
    </select>

    <select style="margin-left: 10px; margin-bottom: 10px;" class="ag-theme-balham">
        <option *ngFor="let item of filters" value={{item.filter}}>{{item.filter}}</option>
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

    datasources: any = [];
    datasource: string;
    variables: any = [];
    filters: any = [];
    rowData: any;

    constructor(private http: HttpClient, public restApi: RestApiService) { }

    ngOnInit() {
        this.rowData = this.http.get('http://dev.itis-app.com/care-rest/api/v1/frequency-analysis?datasource=IXNS_2008-2019&filterName=County%5C%5CLaramie&suppressNulls=true&variableName=C001%3A%20County');
        this.loadDataSources();
    }

    // get datasources
    loadDataSources() {
        return this.restApi.getDataSources().subscribe((data: {}) => {
            this.datasources = data;
        });
    }

    onDataSourceChange(value: string) {
        this.datasource = value;
        this.getVariables();
        this.getFilters();
    }

    getVariables() {
        return this.restApi.getVariables(this.datasource).subscribe((data: {}) => {
            this.variables = data;
        });
    }

    getFilters() {
        return this.restApi.getFilters(this.datasource).subscribe((data: {}) => {
            this.filters = data;
        });
    }

}