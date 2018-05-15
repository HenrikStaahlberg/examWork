import { StepButton } from "./step-button";
import { Question } from "./question";
import { zElement } from "./zElement";
import { RequiredInput } from "./requiredInput";
import { PlacePosition } from "../../shared/positions.enum";

export class Step {
    _id: number;
    description: string;
    faultMessage: string;
    infoPosition: PlacePosition = PlacePosition.CENTER;
    width: number = 450;

    elementIds: string[];
    canClickElement: boolean;
    buttons: StepButton[];

    canMoveForward: boolean;
    canMoveBackward: boolean;
    questions: Question[];
    acceptableALinks: string[];
    overlayElements: string[];

    disabledElements: string[];
    requiredInputs: RequiredInput[];
}
