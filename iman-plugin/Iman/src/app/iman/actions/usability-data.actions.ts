import { Action } from '@ngrx/store';
import { Step } from '../models/step';
import { Manual } from '../models/manual';
import { Question } from '../models/question';

export const SAVE_STEP_DATA_START = "iman/SAVE_STEP_START";
export const SAVE_STEP_DATA_STOP = "iman/SAVE_STEP_STOP";
export const SAVE_QUESTION_DATA = "iman/SAVE_QUESTION_DATA";

export const LOG_FAULTY_USER_INTERACTION = "iman/LOG_FAULTY_USER_INTERACTION";
export const LOG_CORRECT_USER_INTERACTION = "iman/LOG_CORRECT_USER_INTERACTION";

export class SaveStepStartAction implements Action {
    readonly type = SAVE_STEP_DATA_START;
    constructor(public payload: { manual: Manual, step: Step, userId: string }){}
}

export class SaveStepStopAction implements Action {
    readonly type = SAVE_STEP_DATA_STOP;
    constructor(public payload: { manual: Manual, step: Step, userId: string }){}
}

export class SaveQuestionDataAction implements Action {
    readonly type = SAVE_QUESTION_DATA;
    constructor(public payload: { manual: Manual, step: Step, questions: Question[], userId: string }){}
}

export class LogFaultyUserInteractionAction implements Action {
    readonly type = LOG_FAULTY_USER_INTERACTION;
    constructor(public payload: { manual: Manual, step: Step, userId: string }){};
}

export class LogCorrectUserInteractionAction implements Action {
    readonly type = LOG_CORRECT_USER_INTERACTION;
    constructor(public payload: { manual: Manual, step: Step, userId: string}){};
}

export type Action
    = SaveStepStartAction
    | SaveStepStopAction
    | SaveQuestionDataAction
    | LogFaultyUserInteractionAction
    | LogCorrectUserInteractionAction
