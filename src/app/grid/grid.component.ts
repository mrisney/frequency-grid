import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestApiService } from '../services/rest-api.service';
import { FrequencyAnalysisRequest } from '../shared/frequency-analysis-request';
import { StatusBarPanelComponent } from '../status-bar-panel/status-bar-panel.component';

@Component({
    selector: 'frequency-grid',
    template: `
    <select style="margin-left: 5px; margin-bottom: 10px;" class="ag-theme-balham" (change)="onDataSourceChange($event.target.value)">
        <option *ngFor="let item of datasources" value={{item.datasource}}>{{item.datasource}}</option>
    </select>
    
    <select style="margin-left: 10px; margin-bottom: 10px; width: 180px" class="ag-theme-balham" (change)="onVariableChange($event.target.value)">
        <option *ngFor="let item of variables" value={{item.variable}}>{{item.variable}}</option>
    </select>
    
    <select style="margin-left: 10px; margin-bottom: 10px; width: 180px" class="ag-theme-balham" (change)="onFilterChange($event.target.value)">
        <option *ngFor="let item of filters" value={{item.filter}}>{{item.filter}}</option>
    </select>

    <label style="margin-left: 10px; margin-bottom: 10px;" class="ag-theme-balham">Supress Nulls ?
        <input (change)="onNullableChange($event)" value="isNullable" type="checkbox"/>
    </label>
    
    <ag-grid-angular 
        style="width: 675px; height: 500px;" 
        class="ag-theme-balham"
        [rowData]="rowData | async"
        [enableRangeSelection]="true"
        [enableCharts]="true"
        [allowContextMenuWithControlKey]="true"
        [columnDefs]="columnDefs"
        [statusBar]="statusBar"
        [rowSelection]="rowSelection"
        [frameworkComponents]="frameworkComponents"
        (gridReady)="onGridReady($event)">
    </ag-grid-angular>
  `,
    styleUrls: ['grid.component.scss'],
    encapsulation: ViewEncapsulation.ShadowDom
})
export class GridComponent implements OnInit {

    private gridApi;
    private gridColumnApi;
    public statusBar;

    datasource: string;
    datasources: any = [];
    variables: any = [];
    filters: any = [];

    request: FrequencyAnalysisRequest;
    rowData: any;
    public rowSelection;
    public frameworkComponents;

    columnDefs = [
        { headerName: 'County', field: 'variableCodes', sortable: true, filter: true },
        { headerName: 'Frequency', field: 'frequency1', sortable: true, filter: true },
        { headerName: 'Cum Frequency', field: 'cumulativeFrequency1', sortable: true, filter: true },
        { headerName: 'Percent', field: 'percent1', sortable: true, filter: true },
        { headerName: 'Cum Percent', field: 'cumulativePercent1', sortable: true, filter: true },
    ];

    constructor(private http: HttpClient, public restApi: RestApiService) {

    }

    ngOnInit() {
        this.rowData = this.http.get('http://dev.itis-app.com/care-rest/api/v1/frequency-analysis?datasource=IXNS_2008-2019&filterName=County%5C%5CLaramie&suppressNulls=true&variableName=C001%3A%20County');
        this.loadDataSources();
        this.request = new FrequencyAnalysisRequest();
        this.request.suppressNulls = true;
        this.rowSelection = "multiple";
        this.frameworkComponents = {
            statusBarPanelComponent: StatusBarPanelComponent
        };
        this.statusBar = {
            statusPanels: [
                { statusPanel: 'agTotalAndFilteredRowCountComponent' },
                { statusPanel: 'statusBarPanelComponent' },
                {
                    statusPanel: 'agAggregationComponent',
                    statusPanelParams: {
                        aggFuncs: ['count', 'sum']
                    }
                }
            ]
        };
    }
    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        params.api.sizeColumnsToFit();
    }

    // Get links list
    loadDataSources() {
        return this.restApi.getDataSources().subscribe((data: {}) => {
            this.datasources = data;
        });
    }

    onDataSourceChange(value: string) {
        this.datasource = value;
        this.getVariables();
        this.getFilters();
        this.request.dataSourceName = value;
        this.getFrequencyAnalysis();
    }

    onVariableChange(value: string) {
        this.request.variableName = value;
        this.getFrequencyAnalysis();
    }

    onFilterChange(value: string) {
        this.request.filterName = value;
        this.getFrequencyAnalysis();
    }

    onNullableChange(value: any) {
        console.log(value.currentTarget.checked);
        this.request.suppressNulls = value.currentTarget.checked;
        this.getFrequencyAnalysis();
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

    getFrequencyAnalysis() {
        console.log(JSON.stringify(this.request));
        this.rowData = this.restApi.getFrequencyAnalysis(this.request);
    }

    pieChart() {
        var cellRange = {
            rowStartIndex: 0,
            rowEndIndex: this.gridApi.getDisplayedRowCount(),
            columns: ['variableCodes', 'frequency1']
        };
        var chartRangeParams = {
            cellRange: cellRange,
            chartType: 'pie'
        };
        this.gridApi.chartRange(chartRangeParams);
    }

    stackedBarChart() {
        var cellRange = {
            rowStartIndex: 0,
            rowEndIndex: this.gridApi.getDisplayedRowCount(),
            columns: ['variableCodes', 'frequency1']
        };
        var chartRangeParams = {
            cellRange: cellRange,
            chartType: 'stackedBar'
        };
        this.gridApi.chartRange(chartRangeParams);
    }

}