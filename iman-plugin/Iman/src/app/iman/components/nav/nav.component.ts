import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Manual } from '../../models/manual';
import { Observable } from 'rxjs/Observable';
import { IAppState } from '../../../store/index';
import * as manualActions from './../../actions/manual.actions';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'iman-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnChanges {

  @Input() currentManual: Manual;
  @Input() manuals: Manual[];

  private canStepForward: boolean = true;
  private canStepBackward: boolean = true;

  @Output() stepForward = new EventEmitter<void>();
  @Output() stepBackward = new EventEmitter<void>();
  @Output() moveToManual = new EventEmitter<Manual>();
  @Output() close = new EventEmitter<void>();

  moveTo(manual: Manual) {
    this.moveToManual.emit(manual);
  }

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
  }

  ngOnInit(){
  }

  ngOnChanges() {
    if(this.currentManual)
    {
      this.canStepForward = this.currentManual.steps[this.currentManual.currentStep].canMoveForward;
      this.canStepBackward = this.currentManual.steps[this.currentManual.currentStep].canMoveBackward;
    }
  }
}
