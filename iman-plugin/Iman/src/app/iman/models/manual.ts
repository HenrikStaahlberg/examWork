import { Step } from "./step";


export class Manual {
    _id: number;
    title: string;
    steps: Step[];
    currentStep: number;
}
