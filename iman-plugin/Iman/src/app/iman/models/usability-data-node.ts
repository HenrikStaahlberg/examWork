import { Manual } from "./manual";
import { Step } from "./step";
import { instructionFault } from "./usability-instruction-faults";
import { Question } from "./question";

export interface usabilityDataNode {
    userId: string;

    manual: Manual;
    step: Step;

    startTime: Date;
    finishTime: Date;

    acceptableClicks: Number;
    faults: Number;
    answeredQuestions: Question[];
    nrOfViews: Number;
} 