import { Component, OnInit } from '@angular/core';
import * as AlertMessageConstant from '../../utils/alert-message.constant';

@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.scss'],
})
export class AlertMessageComponent implements OnInit {
  toasts: any[];
  constructor() {}

  ngOnInit(): void {
    this.toasts = [
      { key: AlertMessageConstant.KEY.TL },
      { key: AlertMessageConstant.KEY.TC },
      { key: AlertMessageConstant.KEY.TR },
      { key: AlertMessageConstant.KEY.BL },
      { key: AlertMessageConstant.KEY.BC },
      { key: AlertMessageConstant.KEY.BR },
    ];
  }

  findPositionByKey(key: string): string {
    let position = '';
    switch (key) {
      case AlertMessageConstant.KEY.TL:
        position = AlertMessageConstant.POSITION.TOP_LEFT;
        break;
      case AlertMessageConstant.KEY.TC:
        position = AlertMessageConstant.POSITION.TOP_CENTER;
        break;
      case AlertMessageConstant.KEY.TR:
        position = AlertMessageConstant.POSITION.TOP_RIGHT;
        break;
      case AlertMessageConstant.KEY.BL:
        position = AlertMessageConstant.POSITION.BOTTOM_LEFT;
        break;
      case AlertMessageConstant.KEY.BC:
        position = AlertMessageConstant.POSITION.BOTTOM_CENTER;
        break;
      case AlertMessageConstant.KEY.BR:
        position = AlertMessageConstant.POSITION.BOTTOM_RIGHT;
        break;

      default:
        break;
    }
    return position;
  }
}
