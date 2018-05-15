import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as imanActions from './iman/actions/iman.actions';
import { Observable } from 'rxjs/Observable';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/catch';
import { Manual } from './iman/models/manual';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';

  manual$: Observable<Manual>;

  constructor(private store: Store<any>) {
    this.manual$ = this.store.select(state => state.manuals.currentManual);
  }

  ngOnInit() {

    // Check if on from local storage
    let savedIsOn = (localStorage.getItem('isOn') === 'true');
    if(savedIsOn)
    {
      this.store.dispatch(new imanActions.SetAppOnAction());
      (<any>window).communicator.set("START", "");
    } 

    // Subscribes to communicators isOn attribute to resolve changes, handles on and off for the manual from internal and external events
    (<any>window).communicator.getOn().skip(1).subscribe(isOn => {
      if(isOn)
      {
        this.store.dispatch(new imanActions.SetAppOnAction());
        window.location.reload(true);
      }
      else {
        this.store.dispatch(new imanActions.SetAppOffAction());
        window.location.reload(true);
      }
    });
  }
}
