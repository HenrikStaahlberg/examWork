import { Component, OnInit, SimpleChanges, DoCheck } from '@angular/core';
import { Step } from '../../models/step';
import { Manual } from '../../models/manual';
import { Observable } from 'rxjs/Observable';
import { StepButton } from '../../models/step-button';
import { ButtonAction } from '../../models/button-actions';
import { IAppState } from '../../../store/index';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/first';
import * as manualActions from './../../actions/manual.actions';
import * as usabilityDataActions from './../../actions/usability-data.actions';
import { OnChanges, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Button } from 'protractor';
import { InputType } from '../../models/requiredInput';
import { MatDialog } from '@angular/material';
import { DialogRequiredUserAction } from '../dialog-required-user-action/dialog-required-user-action.component';

@Component({
  selector: 'iman-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss']
})
export class StepComponent implements OnInit, DoCheck, OnDestroy {
 
  manual$: Observable<Manual>;
  manuals$: Observable<Manual[]>;
  element: Element; 
  allElements: Element[] = [];
  currentStep: Step;
  imanElementsZindex: Number;
  dialogRef: any;

  mutationObserver = new MutationObserver(function(mutations) {
     mutations.forEach(function(mutation) {
    })
  })

  constructor(
    private store: Store<any>,
    public dialog: MatDialog) {
    this.manual$ = this.store.select(state => state.manuals.currentManual);
    this.manuals$ = this.store.select(state => state.manuals.manuals);

    document.documentElement.addEventListener('click', this.eventTriggered(event), true);

    this.mutationObserver.observe(document.body, {childList: true});
  }

  // Opens information dialog
  openDialog(message: string): void {
    this.dialogRef = this.dialog.open(DialogRequiredUserAction, {
      width: '250px',
      data: { msg: message }
    });
  }

  ngOnInit() {
    // Subscribes for changes to current manual to update element and current step
    this.manual$.subscribe(manual => {
      if (manual){

        let prevStep;
        if (this.currentStep)
          prevStep = Object.assign({}, this.currentStep);
        
        this.currentStep = manual.steps[manual.currentStep];

        let currStep = this.currentStep;
        let sto = this.store;
        //console.log("Prev step: 69 "+prevStep);
        //console.log("Curr step: 70 "+currStep);
        if (!prevStep || prevStep._id !== currStep._id)
        {// Stores the new step data in store
          let inputElement = <HTMLInputElement>document.getElementById("hiddenMeridixCurrentContextJson");
          //console.log("Input: 74 "+inputElement);
          if(inputElement) {
            let contextJson = JSON.parse(inputElement.value);
            sto.dispatch(new usabilityDataActions.SaveStepStartAction({ manual, step: currStep, userId: contextJson.userId }));        
          } else {
            //console.log("Windows onload should trigger: 79");
            window.onload = function(){
              // Stores the new step data in store
                let inputElement = <HTMLInputElement>document.getElementById("hiddenMeridixCurrentContextJson");
                //console.log("Input: 83 "+inputElement);
                if(inputElement) {
                  let contextJson = JSON.parse(inputElement.value);
                  sto.dispatch(new usabilityDataActions.SaveStepStartAction({ manual, step: currStep, userId: contextJson.userId }));        
                }
              }
          }
        }    

        if(prevStep)
        {
          // Reset elements z-index
          this.imanElementsZindex = 10000;
        }
      }
    })
  }

  // Moves a number of steps in the current manual
  step(steps: number) {
    this.manual$.first().subscribe(manual => {
      if(manual.currentStep + steps < manual.steps.length && manual.currentStep + steps >= 0)
      {
        this.stepTo(manual.currentStep + steps)
      }
    })
  }

  // Moves to a specific step in the current manual
  stepTo(step: number) {
     
    this.manual$.first().subscribe(manual => {
      if(step > manual.currentStep && !this.checkRequiredInputs())
      { 
        let inputElement = <HTMLInputElement>document.getElementById("hiddenMeridixCurrentContextJson");
          if(inputElement) {
            let contextJson = JSON.parse(inputElement.value);
            this.store.dispatch(new usabilityDataActions.LogFaultyUserInteractionAction({manual, step: this.currentStep, userId: contextJson.userId }));
      }
      }
      else if(step < manual.steps.length && step >= 0)
      {
        this.stepDispatch(step);
      }
    });
  
}

  // Check if input is valid for continue of step
  checkRequiredInputs(): boolean {

    // Check if there are any required elements
    if(!this.currentStep.requiredInputs || this.currentStep.requiredInputs.length === 0)
      return true;

      let isOk = false;

      let inputMsg = '';

      this.currentStep.requiredInputs.forEach(input => {
      switch(input.type) 
      {
        case InputType.TEXTAREA:
          let elem = <HTMLTextAreaElement>document.getElementsByClassName(input.elementImanId)[1]; //Change this when we have unique class names
          if(elem.value)
            isOk = true;
          else
          {
            inputMsg = input.notDoneMsg;
          }
          break;
        case InputType.CHECKBOX:
          let elements = document.getElementsByClassName(input.elementImanId);
          for(let i = 0; i < elements.length; i++) {
            if((<HTMLInputElement>elements[i]).checked){
              isOk = true;
              break;
            }
            else{
              inputMsg = input.notDoneMsg;
            }
            
          }
          break;
        default:
          console.error("Input: "+ input.type + " not implemented.");
          break;
      }
    })
    if(!isOk)
      this.openDialog(inputMsg);

    return isOk;
  }

  // Handles the actions from the buttons in the step information bubble
  clickBubbleButton(event) {
    switch(event.action)
    {
      case ButtonAction.CONTINUE:
        this.step(1);
        break;
      case ButtonAction.SKIPTO:
        this.stepTo(event.actionValue);
        break;
      case ButtonAction.ANSWER_QUESTION:
        this.answerQuestion();
        break;
      case ButtonAction.CLOSE:
        this.closeIman();
        break;
      default: 
        console.log("Action not implemented");
    }
  }

  // Called to completed the current step
  stepCompleted(event) {
    // Futher logic might be added here
    this.step(1);
  }

  answerQuestion() {
    this.manual$.first().subscribe(manual => {
      let inputElement = <HTMLInputElement>document.getElementById("hiddenMeridixCurrentContextJson");
          if(inputElement) {
            let contextJson = JSON.parse(inputElement.value);
            this.store.dispatch( new usabilityDataActions.SaveQuestionDataAction({ manual, step: this.currentStep, questions: this.currentStep.questions, userId: contextJson.userId }))
          }
    });
    
    this.step(1);
  }

  stepDispatch(step: number)
  {
    // Stores old step data in store
    this.manual$.first().subscribe(manual => {
      let inputElement = <HTMLInputElement>document.getElementById("hiddenMeridixCurrentContextJson");
      if(inputElement) {
        let contextJson = JSON.parse(inputElement.value);
      this.store.dispatch(new usabilityDataActions.SaveStepStopAction({manual, step: this.currentStep, userId: contextJson.userId }));
      }
    })

    // Changes the current step in store
    this.store.dispatch(new manualActions.StepInManualAction(step));
  }

  moveToManual(manualEvent) {
    this.store.dispatch(new manualActions.SetCurrentManualAction(manualEvent));
  }

  ngDoCheck() {
    this.manual$.first().subscribe(manual => {
      if(manual)
      {
        // Gets and stores the element
        if(manual.steps[manual.currentStep].elementIds.length !== 0)
          this.element = document.getElementsByClassName(manual.steps[manual.currentStep].elementIds[0])[0];

        this.allElements = [];

        manual.steps[manual.currentStep].elementIds.forEach(elem => {
          // Stores all elements that should be highlighted
          if(elem)
          {
            let tempElem = document.getElementsByClassName(elem)[0];

            if(tempElem && !this.allElements.includes(tempElem))
              {
                this.allElements.push(tempElem);              
              }
          }
        })

        // console.log(this.allElements);

        // Sets z-index of Iman elements to appear below overlay elements
        let lowestOverlayZindex = 10000;
        if(this.currentStep){
          this.currentStep.overlayElements.forEach(elem => {
            if(elem)
            {
              let tempEl = document.getElementsByClassName(elem)[0];
              if(tempEl) {
                let newEl = <HTMLElement>tempEl;
                if (lowestOverlayZindex > Number(newEl.style.zIndex)) {
                  lowestOverlayZindex = Number(newEl.style.zIndex);
                }
            }
          }
        });
        }
        this.imanElementsZindex = Number(lowestOverlayZindex - 1);
        }
    });
  }

  closeIman() {
    // Implement are you sure- popup here unless end of manual have been reached.


    this.stepDispatch(0);

    (<any>window).communicator.set("STOP", "");
  }

  // Handels events on the DOM 
  eventTriggered(event: any) {
    return (event: any) => {

      let stopEvent = false;

      // Check the event target for capturing the requested element event ant capture unwanted events and preventing them
      if (event.target && this.element) {

        // Check if it has clickable element for continuing
        if (this.hasArrayElementAsParent(event.target, this.allElements) && this.currentStep && this.currentStep.canClickElement) {
          this.step(1);
          return;
        } else if (this.checkIfAOrInputTagParent(event.target, this.element)){
          stopEvent = true;
        }
      } else if (event.target && !this.element && this.checkIfAOrInputTagParent(event.target, null) ) {
        stopEvent = true;
      }
 
      // Check if mouseclick is within element
      if(event instanceof MouseEvent && !this.isWithinArrayElemens(event, this.allElements)){
        stopEvent = true;
      }

      // Check if target is within acceptable links
      if(this.currentStep)
      this.currentStep.acceptableALinks.forEach(elementId => {       
          let element = document.getElementsByClassName(elementId)[0];
          if(element && element.contains(event.target)){
            stopEvent = false;
            this.logCorrectUserInteraction();
          }
      });

      // Check if target is within overlay element
      if(this.currentStep)
      {
        this.currentStep.overlayElements.forEach(element => {
          let elem = document.getElementsByClassName(element)[0];
          if(elem && elem.contains(event.target)) {
            if(event instanceof MouseEvent && this.isWithinElement(event, elem)){
              stopEvent = false;
              this.logCorrectUserInteraction();
            }
          }
        })
      }

      // Check if target is a iman-component
      if(this.checkIfParentHasClass(event.target, "iman-component")){
        stopEvent = false;
      }

      // Check if target has disabled element as parent
      if(this.currentStep){
        this.currentStep.disabledElements.forEach(element => {
          let elem = document.getElementsByClassName(element)[0];
          if(elem && elem.contains(event.target)) {
            stopEvent = true;
          }
        });
      }

      // Stops the event if is should
      if(stopEvent)
        this.preventEvent();
    }
  }

  //Log correct user interaction
  logCorrectUserInteraction(){
    this.manual$.first().subscribe(manual => {
      let inputElement = <HTMLInputElement>document.getElementById("hiddenMeridixCurrentContextJson");
      if(inputElement) {
        let contextJson = JSON.parse(inputElement.value);
        this.store.dispatch(new usabilityDataActions.LogCorrectUserInteractionAction({manual, step: this.currentStep, userId: contextJson.userId}));
      }
    })
  }

  // Prevent links from being followed keeping user in manual
  preventEvent(){
    event.stopPropagation();
    event.preventDefault();
    console.log("Link was not followed: Add popup here?");
    this.manual$.first().subscribe(manual => {
      let inputElement = <HTMLInputElement>document.getElementById("hiddenMeridixCurrentContextJson");
            if(inputElement) {
              let contextJson = JSON.parse(inputElement.value);
              this.store.dispatch(new usabilityDataActions.LogFaultyUserInteractionAction({manual, step: this.currentStep, userId: contextJson.userId}));
            }
    })
  }

  // Check if a parent has a certain class
  private checkIfParentHasClass(element, className: string): boolean {
    for(;element && element !== document; element = element.parentNode) {
      if(element.classList.contains(className)){
        return true;
      }
    }
    return false;
  }

  // Returns true if element has A-tag parent
  private checkIfAOrInputTagParent(element, okElement): boolean {
    for(;element && element !== document; element = element.parentNode) {
      if((element.tagName === 'A' || element.tagName === 'INPUT' ) && (!okElement || (okElement && okElement.id !== element.id)))
        return true;
    }
    return false;
  }

  // Check if element has parent element in array
  private hasArrayElementAsParent(element, parents: Array<Element>): boolean {
    let result = false;

    parents.forEach(parent => {
      if(this.hasElementAsParent(element, parent)){
        result = true;
      }
    })
    return result;
  }

  // Checks if element has parent element
  private hasElementAsParent(element, parent): boolean {
    for(; element && element !== document; element = element.parentNode) {
      if (element === parent)
        return true;
    }
    return false;
  }

  // Check if within array of elements
  private isWithinArrayElemens(click: MouseEvent, array: Element[]): boolean {
    let result = false;
    array.forEach(element => {
      if(this.isWithinElement(click, element))
      {
        result = true;
      }
    })
    return result;
  }

  // Checks if element is within element
  private isWithinElement(click: MouseEvent, outer: Element): boolean {
    if (click.clientX >= outer.getBoundingClientRect().left &&
        click.clientX <= outer.getBoundingClientRect().right &&
        click.clientY <= outer.getBoundingClientRect().bottom &&
        click.clientY >= outer.getBoundingClientRect().top ) 
    {
      return true;
    } else {
      return false;
    }
  }

  ngOnDestroy(): void {
  }
}
