import { Component, OnInit } from '@angular/core';
import { Manual } from './models/manual';
import { Observable } from 'rxjs/Observable';
import { IAppState } from '../store/index';
import 'rxjs/add/operator/first';
import { Subscription } from 'rxjs/Subscription';
import { Subscriber } from 'rxjs/Subscriber';
import { Store } from '@ngrx/store';
import * as manualActions from './actions/manual.actions';
import { OnChanges, DoCheck } from '@angular/core/src/metadata/lifecycle_hooks';
import { usabilityDataNode } from './models/usability-data-node';
import { UsabilityDataService } from './services/usability-data.service';

@Component({
  selector: 'app-iman',
  template: `
    <div class="iman-theme">
      <iman-step></iman-step>
    <div>
  `,
  styles: []
})
export class ImanComponent implements OnInit, OnChanges, DoCheck {

  manuals$: Observable<Manual[]>
  isLoaded$: Observable<boolean>
  currentManual$: Observable<Manual>
  usabilityData$: Observable<usabilityDataNode[]>
  oldData: usabilityDataNode[] = []

  constructor(
    private store: Store<any>,
    private usabilitydataService: UsabilityDataService) {
      this.manuals$ = this.store.select(state => state.manuals.manuals);
      this.isLoaded$ = this.store.select(state => state.manuals.manualsLoaded);
      this.currentManual$ = this.store.select(state => state.manuals.currentManual);
      this.usabilityData$ = this.store.select(state => state.usabilityData.allData);
     }

  ngOnInit() {
    // Loads manuals if there are none from local storage
    this.manuals$.first().subscribe(manuals => {
      if(manuals.length === 0)
        this.getManuals();
    });
  
    this.isLoaded$
      .subscribe(doneLoading => {
        // Sets the current manual if non exist from local storage
        this.currentManual$.subscribe(manual => {
          if(doneLoading && !manual)
          {
            this.setFirstManual();
          }
        })
    })

    this.usabilityData$.subscribe(data => {
      
      if(this.oldData.length === 0)
      {
        if(data.length !== 0)
          this.usabilitydataService.postUsabilityData(data[0]);
      } else
      {
      for(let i = 0; i < data.length; i++){
        if(this.oldData.length < i){
          this.usabilitydataService.postUsabilityData(data[i]);
        }
        else if (JSON.stringify(this.oldData[i]) !== JSON.stringify(data[i])){
          this.usabilitydataService.postUsabilityData(data[i]);
        }
      }
    }

      this.oldData = data;
    });
  }

  ngDoCheck() {
  }

  ngOnChanges() {
  }

  getManuals() {
    this.store.dispatch(new manualActions.LoadManualsAction());
  }

  setFirstManual() {
    this.manuals$.first().subscribe(manuals => {
      this.store.dispatch(new manualActions.SetCurrentManualAction(manuals[0]));
    });
  }
}
