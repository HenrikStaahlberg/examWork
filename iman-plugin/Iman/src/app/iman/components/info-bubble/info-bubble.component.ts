import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Manual } from '../../models/manual';
import { StepButton } from '../../models/step-button';
import { OnChanges, SimpleChanges, DoCheck, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { ChangeDetectorRef } from '@angular/core';
import { PlacePosition, PositionAttribute } from '../../../shared/positions.enum';
import { Question } from '../../models/question';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';



@Component({
  selector: 'iman-info-bubble',
  templateUrl: './info-bubble.component.html',
  styleUrls: ['./info-bubble.component.scss']
})
export class InfoBubbleComponent implements OnInit, OnChanges, DoCheck, OnDestroy {

  private infoPos: PlacePosition = PlacePosition.RIGHT; // Default position
  private okPos =  { 
    [PlacePosition.RIGHT]: true, 
    [PlacePosition.LEFT]: true, 
    [PlacePosition.BOTTOMRIGHT]: true, 
    [PlacePosition.BOTTOMLEFT]: true, 
    [PlacePosition.TOPRIGHT]: true, 
    [PlacePosition.TOPLEFT]: true, 
  }; 
  positionType = PositionAttribute;

  @Input() element: Element;
  @Input() allElements: Element[]; 
  @Input() description: string;
  @Input() position: PlacePosition = PlacePosition.CENTER;
  @Input() fixedWidth: number = 450;

  @Input() buttons: StepButton[];
  @Input() zIndex: Number = 10000;
  @Output() buttonClick = new EventEmitter<StepButton>();
  @Output() stepCompleted = new EventEmitter<any>();

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnDestroy(): void {
    this.cdr.detach();
  }

  ngOnInit() {
   
  }

  ngOnChanges(change: SimpleChanges) {
    if(change.element)
    {
      this.resetOkPos();
    }
  }

  private resetOkPos() {
    for (var key in this.okPos) {
      this.okPos[key] = true;
    }
  }

  ngDoCheck() {
    this.infoBubblePositionHandler(window.innerHeight, window.innerWidth);
  }

  resizeEvent(event) {
    this.resetOkPos();
    this.infoBubblePositionHandler(event.target.innerHeight, event.target.innerWidth);
  }

  infoBubblePositionHandler(innerHeight, innerWidth) {
    
    let infoBubble = document.getElementById("info-bubble-description");

    while(true)
    {
    //Set position to next possible position
    this.setInfoPos();    
    
    //Place infobubble at that position
    this.cdr.detectChanges();

    //Check if collide with elements & out of window
    if(infoBubble && this.allElements && this.element &&
      (this.doElementCollideArray(infoBubble, this.allElements) || 
      this.isOutOfWindow(infoBubble, innerHeight, innerWidth)))
    {
      this.okPos[this.infoPos] = false;
      continue;
    }   
    break;
    }
  }

  private setInfoPos() {
    if (this.okPos[PlacePosition.RIGHT])
      this.infoPos = PlacePosition.RIGHT;
    else if (this.okPos[PlacePosition.TOPRIGHT])
      this.infoPos = PlacePosition.TOPRIGHT;
    else if (this.okPos[PlacePosition.BOTTOMRIGHT])
      this.infoPos = PlacePosition.BOTTOMRIGHT;
    else if (this.okPos[PlacePosition.TOPLEFT])
      this.infoPos = PlacePosition.TOPLEFT;
    else if (this.okPos[PlacePosition.BOTTOMLEFT])
      this.infoPos = PlacePosition.BOTTOMLEFT;
    else if (this.okPos[PlacePosition.LEFT])
      this.infoPos = PlacePosition.LEFT;
    else
      this.infoPos = PlacePosition.RIGHT;
  }

  private isOutOfWindow(infoBubble, innerHeight, innerWidth): boolean {
    switch (this.infoPos) {
      case PlacePosition.RIGHT:
        if( infoBubble.getBoundingClientRect().height + this.element.getBoundingClientRect().top < innerHeight - 90  &&
            infoBubble.getBoundingClientRect().width + this.element.getBoundingClientRect().right + 20 < innerWidth )
          return false
        break;
      case PlacePosition.TOPRIGHT:
        if( this.element.getBoundingClientRect().top - (20 + infoBubble.getBoundingClientRect().height) > 0 &&
        infoBubble.getBoundingClientRect().width + this.element.getBoundingClientRect().left + 20 < innerWidth )
          return false
        break;
      case PlacePosition.BOTTOMRIGHT:
        if( this.element.getBoundingClientRect().top + (20 + infoBubble.getBoundingClientRect().height) < innerHeight &&
        infoBubble.getBoundingClientRect().width + this.element.getBoundingClientRect().left + 20 < innerWidth )
          return false
        break;
      case PlacePosition.TOPLEFT:
        if( this.element.getBoundingClientRect().top - (20 + infoBubble.getBoundingClientRect().height) > 0 )
          return false
        break;
      case PlacePosition.BOTTOMLEFT:
        if( this.element.getBoundingClientRect().top + (20 + infoBubble.getBoundingClientRect().height) < innerHeight  )
          return false
        break;
      case PlacePosition.LEFT:
        if( this.element.getBoundingClientRect().right - (infoBubble.getBoundingClientRect().width + 20) < 0 )
          return false
        break;
    }
    return true;
  }

  // Calculates position attributes depending on placement position
  setPositionInfo(dir: PositionAttribute): string {
    switch (dir) {
      case PositionAttribute.LEFT:
        if (this.element) {
          if (this.infoPos === PlacePosition.RIGHT) {
            let pos = this.element.getBoundingClientRect().right + 20;
            return pos + "px";
          } else if (this.infoPos === PlacePosition.LEFT) {
            let pos = this.element.getBoundingClientRect().left - (this.fixedWidth + 20);
            return pos + "px";
          } else if (this.infoPos === PlacePosition.TOPRIGHT || this.infoPos === PlacePosition.BOTTOMRIGHT) {
            let pos = this.element.getBoundingClientRect().left;
            return pos + "px";
          } else if (this.infoPos === PlacePosition.TOPLEFT || this.infoPos === PlacePosition.BOTTOMLEFT) {
            let pos = this.element.getBoundingClientRect().right - document.getElementById("info-bubble-description").getBoundingClientRect().width;
            return pos +"px";
          } 
        } else {
          switch(this.position) {
            case PlacePosition.TOPRIGHT:
              return "auto";
            case PlacePosition.CENTER:
              return "50%";
            default:
              return "50%";
        }
      }
      case PositionAttribute.RIGHT:
      {
        switch(this.position) {
          case PlacePosition.TOPRIGHT:
            return "50px";
          case PlacePosition.CENTER:
            return "auto";
          default:
            return "auto";
        }}
      case PositionAttribute.TOP:
        if (this.element) {
          if (this.infoPos === PlacePosition.TOPRIGHT || this.infoPos === PlacePosition.TOPLEFT) {
            let pos = this.element.getBoundingClientRect().top - 20 - document.getElementById("info-bubble-description").getBoundingClientRect().height;
            return pos + "px";
          } else if (this.infoPos === PlacePosition.BOTTOMRIGHT || this.infoPos === PlacePosition.BOTTOMLEFT) {
            let pos = this.element.getBoundingClientRect().bottom + 20;
            return pos + "px";
          } else {
            return this.element.getBoundingClientRect().top + "px";
          }
        }
        else
          {
            switch(this.position) {
              case PlacePosition.TOPRIGHT:
                return "50px";
              case PlacePosition.CENTER:
                return "50%";
              default:
                return "50%";
            }
          }
      case PositionAttribute.BOTTOM:
        return "auto";
      case PositionAttribute.WIDTH:
        return this.fixedWidth + "px";
      case PositionAttribute.HEIGHT:
        return "auto";
      default:
        console.error("Unused enum value entered in function setPostion in info-bubble.components.ts");
        return "";
    }
  }

  // Centers description if there is no element to bind too
  translate(): string {
    if (this.element)
      return "";
    else
    {
      switch(this.position)
      {
        case PlacePosition.TOPRIGHT:
          return "";
        case PlacePosition.CENTER:
          return "translate(-50%,-50%)";
        default:
          return "translate(-50%,-50%)";
      }
    }
  }

  // Check if collide with any elment in array
  private doElementCollideArray(element, allElem: any[]) : boolean {
    let isColliding = false;
    
    allElem.forEach(elem => {
      if (this.doElementsCollide(element, elem)){
        isColliding = true;
      }
    })
    return isColliding;
  }

  // Check if element is overlapping
  private doElementsCollide(el1, el2): boolean {

    return !((el1.getBoundingClientRect().bottom < el2.getBoundingClientRect().top) ||
             (el1.getBoundingClientRect().top > el2.getBoundingClientRect().bottom) ||
             (el1.getBoundingClientRect().right < el2.getBoundingClientRect().left) ||
             (el1.getBoundingClientRect().left > el2.getBoundingClientRect().right))
};

}
