export enum InputType {
    CHECKBOX = <any>"CHECKBOX",
    TEXTAREA = <any>"TEXTAREA"
}

export interface RequiredInput {
    elementImanId: string;
    type: InputType;
    notDoneMsg: string;
}