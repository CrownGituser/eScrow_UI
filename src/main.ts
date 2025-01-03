/*!

=========================================================
* Argon Dashboard PRO Angular - v1.1.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-pro-angular
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";




if (environment.production) {
  enableProdMode();
}
 

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));

  const TAB_KEY = 'activeTab';

  if (localStorage.getItem(TAB_KEY)) {
    alert('The application is already open in another tab. Please close the other tab to continue.');
    window.close();
  } else {
    localStorage.setItem(TAB_KEY, 'true');
  
    window.addEventListener('beforeunload', () => {
      localStorage.removeItem(TAB_KEY);
    });
  }
  