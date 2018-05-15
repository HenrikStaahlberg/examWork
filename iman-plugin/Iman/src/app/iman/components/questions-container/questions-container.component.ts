import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Question } from '../../models/question';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Manual } from '../../models/manual';
import * as manualActions from './../../actions/manual.actions';

@Component({
  selector: 'iman-questions-container',
  templateUrl: './questions-container.component.html',
  styleUrls: ['./questions-container.component.css']
})
export class QuestionsContainerComponent implements OnInit {

  manual$: Observable<Manual>;  

  questions: Question[];
  manual: Manual;

  constructor(private store: Store<any>) {
    this.manual$ = this.store.select(state => state.manuals.currentManual);
   }

  ngOnInit() {
    this.manual$.subscribe(manual => {
      this.questions = manual.steps[manual.currentStep].questions;
      this.manual = manual;
    })
  }

  test(event) {
    this.store.dispatch(new manualActions.SetCurrentAnswerAction({ 
      manual: this.manual, 
      step: this.manual.steps[this.manual.currentStep], 
      question: event.question, 
      answer: event.answer }))
  }
}
