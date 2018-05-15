import { Store } from "@ngrx/store";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

export class ImanCommunicator {

    observable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);  

    private _registered;
    register(callback: any) {
        this._registered = callback;
    }
    set(imanAction: string, payload: any) {
        if (this._registered) {
            this._registered(imanAction, payload);
        }
    }

    ImanComActionHandler(action: ImanComActions, payload: any) {
        switch(action)
        {
            case ImanComActions.START:
                this.observable.next(true);
                break;
            case ImanComActions.STOP:
                this.observable.next(false);
                break;
            default:
                console.error("Action: " + action + " has not been implemented.");
        }
    }
    
    getOn() : Observable<boolean> {
        return this.observable;
    }

    constructor() {
        this.register(this.ImanComActionHandler);
        let initialValue = (localStorage.getItem('isOn') === 'true');
        this.observable.next(initialValue);
    }
}

export enum ImanComActions {
    START = <any>"START",
    STOP = <any>"STOP",
  }


 
