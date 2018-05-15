import * as usabilityDataActions from './../actions/usability-data.actions';

const initialState = {
    allData: [],
};

export function usabilityDataReducer(state = initialState, action: usabilityDataActions.Action ) {
    switch(action.type) {
        case usabilityDataActions.SAVE_STEP_DATA_START:
            return saveStepStartAction(state, action)
        case usabilityDataActions.SAVE_STEP_DATA_STOP:
            return saveStepStop(state, action)
        case usabilityDataActions.SAVE_QUESTION_DATA:
            return saveQuestionDataAction(state, action) 
        case usabilityDataActions.LOG_CORRECT_USER_INTERACTION:
            return logCorrectInteraction(state, action) 
        case usabilityDataActions.LOG_FAULTY_USER_INTERACTION:
            return logFaultyInteraction(state, action)
        default:
            return state;
    }    
} 

function logCorrectInteraction(state, action) {
    return {
        ...state,
        allData: state.allData.map(data => {
            if (data.manual._id === action.payload.manual._id && data.step._id === action.payload.step._id && data.userId === action.payload.userId)
            {
                const newData = {
                    ...data,
                    acceptableClicks: data.acceptableClicks + 1
                };
                return newData;
            } else 
                return data;
        })
    }
}

function logFaultyInteraction(state, action) {
    return {
        ...state,
        allData: state.allData.map(data => {
            if (data.manual._id === action.payload.manual._id && data.step._id === action.payload.step._id && data.userId === action.payload.userId)
            {
                const newData = {
                    ...data,
                    faults: data.faults + 1 
                };
                return newData;
            } else 
                return data;
        })
    }
}

function saveQuestionDataAction(state, action) {
    return {
        ...state,
        allData: state.allData.map(data => {
            if (data.manual._id === action.payload.manual._id && data.step._id === action.payload.step._id && data.userId === action.payload.userId)
            {
                const newData = {
                    ...data,
                    questions: action.payload.questions
                };
                return newData;
            } else 
                return data;
        })
    }
}

function saveStepStartAction(state, action) {
    const newData = {
        userId: action.payload.userId,
        manual: action.payload.manual,
        step: action.payload.step,
        startTime: Date.now(),
        acceptableClicks: 0,
        faults: 0,
        nrOfViews: 1
    }
    if(state.allData.find(data => (
        data.manual._id === newData.manual._id && data.step._id === newData.step._id && data.userId === action.payload.userId
    )))
    return {
        ...state,
        allData: state.allData.map(data => {
            if(data.manual._id === action.payload.manual._id && data.step._id === action.payload.step._id && data.userId === action.payload.userId) {
                const copiedData = {
                    ...data,
                    nrOfViews: data.nrOfViews + 1
                };
                return copiedData;
            }
            return data;
        })

    }
    else
    return {
        ...state,
        allData: [...state.allData, newData]
    };
}

function saveStepStop(state, action) {
        return {
            ...state,
            allData: state.allData.map(data => {
                if (data.manual._id === action.payload.manual._id && data.step._id === action.payload.step._id && data.userId === action.payload.userId && !data.finishTime) {
                    const newData = {
                        ...data,
                        finishTime: Date.now()
                    };
                    return newData;
                }
                return data;
            })
        };
    }