import { Manual } from "../models/manual";
import { Action } from '@ngrx/store';
import { Step } from "../models/step";
import { Question } from "../models/question";

export const STEP_IN_MANUAL = "iman/STEP_IN_MANUAL";
export const SET_CURRENT_MANUAL = "iman/SET_CURRENT_MANUAL";

export const LOAD_MANUALS = "iman/LOAD_MANUALS";
export const LOAD_MANUALS_SUCCESS = "iman/LOAD_MANUALS_SUCCESS";
export const LOAD_MANUALS_ERROR = "iman/LOAD_MANUALS_ERROR";

export const SET_CURRENT_ANSWER = "iman/SET_CURRENT_ANSWER";

export const SET_CURRENT_URL = "iman/SET_CURRENT_URL";

export class LoadManualsAction implements Action {
    readonly type = LOAD_MANUALS;
    constructor(){}
}

export class LoadManualsSuccessAction implements Action {
    readonly type = LOAD_MANUALS_SUCCESS;
    constructor(public payload: Manual[]){} 
}

export class SetCurrentManualAction implements Action {
    readonly type = SET_CURRENT_MANUAL;
    constructor(public payload: Manual) {}
}

export class StepInManualAction implements Action {
    readonly type = STEP_IN_MANUAL;
    constructor(public payload: number) {}
}

export class SetCurrentAnswerAction implements Action {
    readonly type = SET_CURRENT_ANSWER;
    constructor(public payload: { manual: Manual, step: Step, question: Question, answer: string }){}
}

export class SetCurrentStepURL implements Action {
    readonly type = SET_CURRENT_URL;
    constructor(public payload: { manual: Manual, step: Step, url: string }){}
}

export type Action
    = LoadManualsAction
    | LoadManualsSuccessAction
    | SetCurrentManualAction
    | StepInManualAction
    | SetCurrentAnswerAction
    | SetCurrentStepURL
