import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImanComponent } from './iman.component';
import { NavComponent } from './components/nav/nav.component';
import { InfoBubbleComponent } from './components/info-bubble/info-bubble.component';
import { MaterialModule } from '../shared/material.module';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule, Routes } from '@angular/router';
import { StepComponent } from './components/step/step.component';
import { OutOfComponent } from './components/out-of/out-of.component';
import { EffectsModule } from '@ngrx/effects';
import { ManualEffects } from './effects/manual.effects';
import { HighlightComponent } from './components/highlight/highlight.component';
import { ImanCommunicator } from './iman-communicator';
import { MultipleChoiceQuestionComponent } from './components/multiple-choice-question/multiple-choice-question.component';
import { QuestionsContainerComponent } from './components/questions-container/questions-container.component';
import { MarkdownModule } from 'ngx-md';
import { UsabilityDataService } from './services/usability-data.service';
import { DialogRequiredUserAction } from './components/dialog-required-user-action/dialog-required-user-action.component';
import { OverlayContainer } from '@angular/cdk/overlay';

const routes: Routes = [
  {path: '', component: ImanComponent}, 
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    RouterModule.forChild(routes),
    MarkdownModule.forRoot(),
    EffectsModule.forRoot([ManualEffects]),
  ],
  declarations: [
    ImanComponent, 
    NavComponent, 
    InfoBubbleComponent, 
    StepComponent, 
    OutOfComponent, 
    HighlightComponent, 
    MultipleChoiceQuestionComponent, 
    QuestionsContainerComponent,
    DialogRequiredUserAction
  ],
  providers: [
    UsabilityDataService
  ],
  entryComponents: [
    DialogRequiredUserAction
  ]  
})
export class ImanModule { 
  constructor(overlayContainer: OverlayContainer) {
    overlayContainer.getContainerElement().classList.add('iman-theme');
    overlayContainer.getContainerElement().classList.add('iman-component');
  }
}
