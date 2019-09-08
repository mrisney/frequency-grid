import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { AgGridModule } from 'ag-grid-angular';
import { GridComponent } from './grid/grid.component';
import { HttpClientModule } from '@angular/common/http';
import 'ag-grid-enterprise';
import 'ag-grid-enterprise/chartsModule';

@NgModule({
  declarations: [
    GridComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AgGridModule.withComponents([])
  ],
  providers: [],
  entryComponents: [GridComponent]
})
export class AppModule {

  constructor(injector: Injector) {
    const btn = createCustomElement(GridComponent, { injector });
    customElements.define('frequency-grid', btn);

  }

  ngDoBootstrap() { }

}
