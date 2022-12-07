import { Injectable } from '@angular/core';
import { SmartcontrolConfirmDialogComponent } from 'app/smart-control/shares/component/smartcontrol-confirm-dialog/smartcontrol-confirm-dialog.component';
import { SmartcontrolConfirmMessageModel } from 'app/smart-control/shares/component/smartcontrol-confirm-dialog/smartcontrol-confirm-message-model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class SmartcontrolUtilService {
  confirmModDialogRef: MatDialogRef<SmartcontrolConfirmDialogComponent>;
  private alive = true;

  constructor(private dialog: MatDialog) {}

  dateToStringDDMMYYYY(today: Date): string {
    let dd: string;
    let mm: string; //January is 0!

    const yyyy = today.getFullYear();
    if (today.getDate() < 10) {
      dd = '0' + today.getDate();
    } else {
      dd = today.getDate().toString();
    }
    if (today.getMonth() + 1 < 10) {
      mm = '0' + (today.getMonth() + 1);
    } else {
      mm = today.getMonth().toString();
    }
    return dd + '/' + mm + '/' + yyyy;
  }

  getCurrentTimeHHMM(): string {
    const today = new Date();
    let timeReturn: string;
    if (today.getHours() < 10) {
      timeReturn = '0' + today.getHours();
    } else {
      timeReturn = today.getHours().toString();
    }
    if (today.getMinutes() < 10) {
      timeReturn += ':0' + today.getMinutes();
    } else {
      timeReturn += ':' + today.getMinutes().toString();
    }
    return timeReturn;
  }

  getMessageByCode(code: string): string {
    return '';
  }

  isMobile(): boolean {
    var platform = ['Android', 'iPhone', 'Linux'];
    console.log(navigator.platform);
    for (var i = 0; i < platform.length; i++) {
      if (navigator.platform.indexOf(platform[i]) > -1) {
        return true;
      }
    }
    return false;
  }

  isMobile2(): string {
    return navigator.platform;
  }

  base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // To split floating data with max digit after dot.
  stringFloatinWithMaxDigit(dataValue: string, maxdigit: number): string {
    let result = '';

    if (dataValue) {
      dataValue += '';
      let datas = dataValue.split('.');
      if (datas.length > 1 && datas[1].length > maxdigit) {
        const value2 = datas[1].substr(0, maxdigit);
        result = datas[0].concat('.') + value2;
      } else {
        result = dataValue;
      }
    }

    return result;
  }

  confirmDialog(
    messageModel: SmartcontrolConfirmMessageModel,
    backdrop: boolean
  ): any {
    let flag: boolean;
    return (this.confirmModDialogRef = this.dialog.open(
      SmartcontrolConfirmDialogComponent,
      {
        hasBackdrop: backdrop,
        data: messageModel,
        minWidth: '30%',
        panelClass: 'custom-dialog-container',
      }
    ));
  }

  confirmModSizeDialog(
    messageModel: SmartcontrolConfirmMessageModel,
    backdrop: boolean,
    widht: string,
    height: string
  ): any {
    let flag: boolean;
    return (this.confirmModDialogRef = this.dialog.open(
      SmartcontrolConfirmDialogComponent,
      {
        hasBackdrop: backdrop,
        data: messageModel,
        width: widht,
        panelClass: 'custom-dialog-container',
      }
    ));
  }
}
