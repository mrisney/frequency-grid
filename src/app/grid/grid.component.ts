import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'frequency-grid',
  template: `
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
  encapsulation: ViewEncapsulation.Emulated
})
export class GridComponent implements OnInit {

  columnDefs = [
    { headerName: 'County', field: 'variableCodes', sortable: true, filter: true },
    { headerName: 'Frequency', field: 'frequency1', sortable: true, filter: true },
    { headerName: 'Cum Frequency', field: 'frequency2', sortable: true, filter: true},
    { headerName: 'Percent', field: 'percent1', sortable: true, filter: true },
    { headerName: 'Cum Percent', field: 'cumulativePercent1', sortable: true, filter: true },
  ];
  
  rowData: any;
  
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.rowData = this.http.get('http://dev.itis-app.com/care-rest/api/v1/frequency-analysis?datasource=IXNS_2008-2019&filterName=County%5C%5CLaramie&suppressNulls=true&variableName=C001%3A%20County');
  }
}