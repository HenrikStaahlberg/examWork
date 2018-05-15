import { Injectable } from '@angular/core'
import { ManualService } from '../services/manual.service';
import { Effect, Actions } from '@ngrx/effects';
import * as manualActions from './../actions/manual.actions';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';

@Injectable()
export class ManualEffects {
   
    @Effect() loadManuals$ = this.actions$
    .ofType(manualActions.LOAD_MANUALS)
    .switchMap(() => this.manualService.getManuals()
        .map(manuals => (new manualActions.LoadManualsSuccessAction(manuals)))
    )

    constructor(
        private manualService: ManualService,
        private actions$: Actions
    ){}

}