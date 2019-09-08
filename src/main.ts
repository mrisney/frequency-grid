import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// for enterprise customers
import {LicenseManager} from "ag-grid-enterprise/main";
LicenseManager.setLicenseKey("SHI_UK_on_behalf_of_Lenovo_Sweden_MultiApp_1Devs6_November_2019__MTU3Mjk5ODQwMDAwMA==e27a8fba6b8b1b40e95ee08e9e0db2cb");



platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
