import { Action } from '@ngrx/store';

export const SET_APP_ON = "iman/SET_APP_ON";
export const SET_APP_OFF = "iman/SET_APP_OFF";

export class SetAppOnAction implements Action {
    readonly type = SET_APP_ON;
    constructor(){}
}

export class SetAppOffAction implements Action {
    readonly type = SET_APP_OFF;
    constructor(){}
}

export type Action
    = SetAppOnAction
    | SetAppOffAction