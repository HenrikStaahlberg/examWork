import * as imanActions from './../actions/iman.actions';

export function imanReducer(state = false, action: imanActions.Action ) {
    switch(action.type) {
        case imanActions.SET_APP_ON:
            return true;
        case imanActions.SET_APP_OFF:
            return false;   
        default:
            return state;
    }    
}