import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, DoBootstrap } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { AgGridModule } from 'ag-grid-angular';
import { GridComponent } from './grid/grid.component';
import { HttpClientModule } from '@angular/common/http';
import 'ag-grid-enterprise';
import 'ag-grid-enterprise/chartsModule';

import {LicenseManager} from 'ag-grid-enterprise';

// tslint:disable-next-line:max-line-length
LicenseManager.setLicenseKey('Nubox_Colombia_SAS_NuboxColombia_single_1_Devs__13_August_2020_[v2]_MTU5NzI3NjgwMDAwMA==582da7f5b8433459a69d707ac9b3b719');

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
export class AppModule implements DoBootstrap {
  constructor(private injector: Injector) {
    const el = createCustomElement(GridComponent, {
      injector: this.injector
    });
    customElements.define('frequency-grid', el);
  }

  ngDoBootstrap() {
  }
}
