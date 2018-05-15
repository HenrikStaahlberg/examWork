import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { usabilityDataNode } from '../models/usability-data-node';

@Injectable()
export class UsabilityDataService{
    
    private _serverUrl = 'http://imantest.westeurope.cloudapp.azure.com:8080/usability-data';

    constructor(private _http: HttpClient) {
    };
    
    postUsabilityData(data: usabilityDataNode): void { 
        this._http.post<usabilityDataNode[]>(this._serverUrl, data)
        .subscribe(
            (val) => {
            },
            response => {
               this.handleError(response);
            },
            () => {
            });
    }

    private handleError(err: HttpErrorResponse) {
        console.log(err.message);
        return Observable.throw(err.message);
    }
}