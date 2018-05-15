import { Manual } from "../iman/models/manual";

// Fix the typing of this state for error handling later


export const initialState: IAppState = {
        manuals: [],
        manualsLoaded: false,
        currentManual: null,
};


export interface IAppState {
    manuals: Manual[];
    manualsLoaded: boolean;

    currentManual: Manual;
}