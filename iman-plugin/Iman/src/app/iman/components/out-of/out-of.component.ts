import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'iman-out-of',
  templateUrl: './out-of.component.html',
  styleUrls: ['./out-of.component.scss']
})
export class OutOfComponent implements OnInit {

  @Input() max: number;
  @Input() current: number; 

  constructor() { }

  ngOnInit() {
  }

}
