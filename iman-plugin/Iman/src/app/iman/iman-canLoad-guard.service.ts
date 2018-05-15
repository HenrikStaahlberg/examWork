import { Injectable } from "@angular/core";
import { CanLoad } from "@angular/router/src/interfaces";
import { Route } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { Store } from "@ngrx/store";

@Injectable()
export class CanLoadGuard implements CanLoad {

    isOn$: Observable<boolean>

    constructor(
        private store: Store<any>) {
          this.isOn$ = this.store.select(state => state.isOn);
         }

    canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
        let returnValue;
        this.isOn$.first().subscribe(isOn => {
            returnValue = isOn;
        })

        return returnValue;
    }
    
}