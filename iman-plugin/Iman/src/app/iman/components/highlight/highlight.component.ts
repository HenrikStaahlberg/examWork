import { Component, OnInit, Input, DoCheck, ChangeDetectorRef, OnChanges, OnDestroy } from '@angular/core';
import { PositionAttribute } from '../../../shared/positions.enum';

var resizeSensor = require('../../../../../node_modules/css-element-queries/src/ResizeSensor');

@Component({
  selector: 'iman-highlight',
  templateUrl: './highlight.component.html',
  styleUrls: ['./highlight.component.scss']
})
export class HighlightComponent implements OnInit, DoCheck, OnChanges, OnDestroy {

  @Input() element: Element;
  @Input() paddingFromElement: number = 5;
  @Input() zIndex: Number = 10000;
  @Input() index: number = 0;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.cdr.detach();
  }

  ngOnChanges(): void {
    if(this.element) {
      let cdr = this.cdr;
      new resizeSensor(this.element, function() {  
        if(!cdr['destroyed']){
          cdr.detectChanges();
        }
      }) 
    }
  }

  ngDoCheck(): void {
  }
  
  setPositionHighlight(dir: PositionAttribute): string {
    switch (dir) {
      case PositionAttribute.LEFT:
        return this.element.getBoundingClientRect().left - this.paddingFromElement + "px";
      case PositionAttribute.RIGHT:
        return this.element.getBoundingClientRect().right + "px";
      case PositionAttribute.TOP:
        return this.element.getBoundingClientRect().top - this.paddingFromElement + "px";
      case PositionAttribute.BOTTOM:
        return this.element.getBoundingClientRect().bottom + "px";
      case PositionAttribute.WIDTH:
        return this.element.getBoundingClientRect().width + (this.paddingFromElement*2) + "px";
      case PositionAttribute.HEIGHT:
        return this.element.getBoundingClientRect().height + (this.paddingFromElement*2) + "px";
      default:
        console.error("Unused enum value entered in function setPostion in info-bubble.components.ts");
        return "";
    }
  }
}
