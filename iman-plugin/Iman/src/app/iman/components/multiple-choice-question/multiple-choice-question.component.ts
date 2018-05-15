import { Component, OnInit, Input, EventEmitter, Output, DoCheck } from '@angular/core';
import { Question } from '../../models/question';

@Component({
  selector: 'iman-multiple-choice-question',
  templateUrl: './multiple-choice-question.component.html',
  styleUrls: ['./multiple-choice-question.component.scss']
})
export class MultipleChoiceQuestionComponent implements OnInit, DoCheck {

  @Input() question: Question;

  @Output() select = new EventEmitter<any>();

  answer: string;

  constructor() { }

  ngOnInit() {
  }

  ngDoCheck() {
    this.answer = this.question.selectedOption;
  }

}
