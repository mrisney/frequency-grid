import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { HttpClient } from '@angular/common/http';
import { RestApiService } from '../services/rest-api.service';
import { FrequencyAnalysisRequest } from '../shared/frequency-analysis-request';
import { StatusBarPanelComponent } from '../status-bar-panel/status-bar-panel.component';

@Component({
    selector: 'frequency-grid',
    template: `
        <form [formGroup]="parameterForm">
            <select style="margin-left: 10px; margin-bottom: 10px;" class="ag-theme-balham"  (change)="onDataSourceChange($event.target.value)">
                <option *ngFor="let item of datasources" value={{item.datasource}}>{{item.datasource}}</option>
            </select>
            
            <select style="margin-left: 10px; margin-bottom: 10px; width: 180px" class="ag-theme-balham" formControlName="variableControl" (change)="onVariableChange($event.target.value)">
                <option *ngFor="let item of variables" value={{item.variable}}>{{item.variable}}</option>
            </select>
            
            <select style="margin-left: 10px; margin-bottom: 10px; width: 180px" class="ag-theme-balham" formControlName="filterControl" (change)="onFilterChange($event.target.value)">
                <option *ngFor="let item of filters" value={{item.filter}}>{{item.filter}}</option>
            </select>
            
            <label style="margin-left: 10px; margin-bottom: 10px;" class="ag-theme-balham">Supress Nulls ?
                <input (change)="onNullableChange($event)" value="isNullable" type="checkbox"/>
            </label>
        </form>
        
        <ag-grid-angular 
            style="width: 100%; height: 100%;" 
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

    @Input() initDatasource: string;
    @Input() initFilter: string;
    @Input() initVariable: string;

    datasource: string;
    variableName: string;
    datasources: any = [];
    variables: any = [];
    filters: any = [];

    parameterForm: FormGroup;
    datasourceSelect: string;

    request: FrequencyAnalysisRequest;
    rowData: any;
    public rowSelection;
    public frameworkComponents;

    columnDefs = [
        { headerName: 'Variable', field: 'variableCodes', sortable: true, filter: true, ColId: 'variableCol' },
        { headerName: 'Frequency', field: 'frequency1', sortable: true, filter: true },
        { headerName: 'Cum Frequency', field: 'cumulativeFrequency1', sortable: true, filter: true },
        { headerName: 'Percent', field: 'percent1', sortable: true, filter: true },
        { headerName: 'Cum Percent', field: 'cumulativePercent1', sortable: true, filter: true },
    ];

    constructor(private fb: FormBuilder, private http: HttpClient, public restApi: RestApiService) {

    }

    ngOnInit() {

        this.loadDataSources();
        this.datasource = this.initDatasource;
        this.request = new FrequencyAnalysisRequest();
        this.request.dataSourceName = this.datasource;
    
        this.getFilters();
        this.request.filterName = this.initFilter;

        this.getVariables();
        this.variableName = this.initVariable;
        this.request.variableName = this.initVariable;
        //const variableColDef = this.gridColumnApi.getColumn('variableCodes').getColDef();
        //variableColDef.headerName = this.initVariable;

        this.parameterForm = this.fb.group({
            variableControl: [this.initVariable],
            filterControl: [this.initFilter]
        });
        console.log('variable : ' + this.variableName + ', filter : ' + this.initFilter);
        this.request.suppressNulls = false;
        this.getFrequencyAnalysis();

        this.rowSelection = 'multiple';
        
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
        const variableColDef = this.gridColumnApi.getColumn('variableCodes').getColDef();
        variableColDef.headerName = value;
        this.gridApi.refreshHeader();
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
        console.log('request = ' + JSON.stringify(this.request));
        this.rowData = this.restApi.getFrequencyAnalysis(this.request);
    }

    pieChart() {
        const cellRange = {
            rowStartIndex: 0,
            rowEndIndex: this.gridApi.getDisplayedRowCount(),
            columns: ['variableCodes', 'frequency1']
        };
        const chartRangeParams = {
            cellRange: cellRange,
            chartType: 'pie'
        };
        this.gridApi.chartRange(chartRangeParams);
    }

    stackedBarChart() {
        const cellRange = {
            rowStartIndex: 0,
            rowEndIndex: this.gridApi.getDisplayedRowCount(),
            columns: ['variableCodes', 'frequency1']
        };
        const chartRangeParams = {
            cellRange: cellRange,
            chartType: 'stackedBar'
        };
        this.gridApi.chartRange(chartRangeParams);
    }
}