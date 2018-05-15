import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';
import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { IAppState, initialState } from './store';
import { ManualService } from './iman/services/manual.service';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule, ActionReducer, MetaReducer } from '@ngrx/store';
import { manualReducer } from './iman/reducers/manual.reducer';
import { localStorageSync } from 'ngrx-store-localstorage';
import { imanReducer } from './iman/reducers/iman.reducer';
import { CanLoadGuard } from './iman/iman-canLoad-guard.service';
import { ImanComponent } from './iman/iman.component';
import { usabilityDataReducer } from './iman/reducers/usability-data.reducer';
import { HashLocationStrategy } from '@angular/common';

const routes: Routes = [
  {path: '', loadChildren: './iman/iman.module#ImanModule', canLoad: [CanLoadGuard]},
  {path: '**', redirectTo: ''}
];

// Defines the local storage and sets it to automatically update with redux state  
export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({keys: [{manuals: ['manuals', 'currentManual', 'manualsLoaded']}, {isOn: 'isOn'}, {usabilityData: 'usabilityData'}], rehydrate: true})(reducer);
}
const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(routes, { useHash: true}),
    StoreModule.forRoot( {manuals: manualReducer, isOn: imanReducer, usabilityData: usabilityDataReducer}, {metaReducers}),
    StoreDevtoolsModule.instrument()
  ],
  providers: [
    ManualService,
    CanLoadGuard,
    HashLocationStrategy
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor() {}
  }

