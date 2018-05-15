import * as manualActions from './../actions/manual.actions';
import { IAppState } from '../../store/index';
import { initialState } from '../../store/IAppState';

export function manualReducer(state = initialState, action: manualActions.Action ) {
    switch(action.type) {
        case manualActions.LOAD_MANUALS_SUCCESS:
            return loadManuals(state,action);
        case manualActions.SET_CURRENT_MANUAL:
            return setCurrentManual(state, action);
        case manualActions.STEP_IN_MANUAL:
            return stepInManual(state, action);
        case manualActions.SET_CURRENT_ANSWER:
            return setAnswer(state, action);
        case manualActions.SET_CURRENT_URL:
            return setUrl(state, action);
        default:
            return state;
    }    
}


function stepInManual (state, action) {
    return {
        ...state,
        manuals: state.manuals.map(manual => {
            if(manual.id === state.currentManual.id)
                return {
                    ...manual,
                    currentStep: action.payload,
                };
                return manual;
        }),
        currentManual: {
            ...state.currentManual,
            currentStep: action.payload,
        }
    }
}

function loadManuals (state, action ) {
    return {
        ...state,
        manuals: action.payload,
        manualsLoaded: true
    }
}

function setCurrentManual (state, action ) {
    return {
        ...state,
        currentManual: action.payload
    }
}

function setAnswer (state, action ) {
    return {
        ...state,
        manuals: state.manuals.map(manual => {
            if (manual.id !== action.payload.manual.id)
                return manual;
            else {
                const newManual = {
                    ...manual,
                    steps: manual.steps.map(step => {
                        if(step.id !== action.payload.step.id && !step.questions)
                            return step;
                        else {
                            const newStep = {
                                ...step,
                                questions: step.questions.map(question => {
                                    if(question.question !== action.payload.question.question)
                                        return question;
                                    else {
                                        const newQuestion = {
                                            ...question,
                                            selectedOption: action.payload.answer 
                                        }
                                        return newQuestion;
                                    }
                                })
                            }
                            return newStep;
                        }
                    })
                }
                return newManual;
            }
        }),
        currentManual: {
            ...state.currentManual,
            steps: state.currentManual.steps.map(step => {
                if(step.id !== action.payload.step.id && !step.questions)
                    return step;
                else {
                    const newStep = {
                        ...step,
                        questions: step.questions.map(question => {
                            if(question.question !== action.payload.question.question)
                                return question;
                            else {
                                const newQuestion = {
                                    ...question,
                                    selectedOption: action.payload.answer 
                                }
                                return newQuestion;
                            }
                        })
                    }
                    return newStep;
                }
            })
        }
    }
}

function setUrl(state, action) {
    return {
        ...state,
        manuals: state.manuals.map(manual => {
            if (manual.id !== action.payload.manual.id)
                return manual;
            else {
                const newManual = {
                    ...manual,
                    steps: manual.steps.map(step => {
                        if(step.id !== action.payload.step.id)
                            return step;
                        else {
                            const newStep = {
                                ...step,
                                url: action.payload.url
                                }
                            return newStep;
                            }
                        })
                    }
                return newManual;
                }
            }),
        currentManual: {
            ...state.currentManual,
            steps: state.currentManual.steps.map(step => {
                if(step.id !== action.payload.step.id)
                    return step;
                else {
                    const newStep = {
                        ...step,
                        url: action.payload.url
                        }
                    return newStep;
                    }
                })
            }
        }
    }
