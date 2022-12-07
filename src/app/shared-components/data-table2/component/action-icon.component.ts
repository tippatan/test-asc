import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-action-icon',
  template: `<i
    class="{{ styleClass }} actionIcon"
    aria-hidden="true"
    tooltip="Entry"
    tooltipPlacement="top"
    (click)="callBackAction(data, actionCallBack)"
  ></i>`,
  styleUrls: ['./action-icon.component.css'],
})
export class ActionIconComponent implements OnInit {
  @Input() actionCallBack: string;
  @Input() data: any;
  @Input() styleClass: string;

  @Output() onCallBackAction = new EventEmitter();
  ngOnInit() {}

  callBackAction(data, actionCallBack) {
    let param = { data: data, actionCallBack: actionCallBack };
    this.onCallBackAction.emit(param);
  }
}
