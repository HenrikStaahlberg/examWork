import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { Manual } from '../models/manual';

@Injectable()
export class ManualService {
    
    private _manualUrl = 'http://imantest.westeurope.cloudapp.azure.com:8080/manuals';

    constructor(private _http: HttpClient) {};
    
    getManuals(): Observable<Manual[]> { 

        return this._http.get<Manual[]>(this._manualUrl)
        .do(data => {
            console.log(data);
        })
        .catch(this.handleError);
    }

    private handleError(err: HttpErrorResponse) {
        console.log(err.message);
        return Observable.throw(err.message);
    }
}