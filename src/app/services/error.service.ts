import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng-lts/api';
import { throwError } from 'rxjs';
import * as MESSAGES from '../utils/messages.constant';
import { Utility } from './../utils/utility';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor(
    private confirmationService: ConfirmationService,
    private util: Utility
  ) {}

  handleError(error: HttpErrorResponse) {
    let messageError = error.error.errorMessage;
    if (this.util.isEmpty(messageError)) {
      messageError = MESSAGES.SYSTEM_ERROR;
    }
    this.confirmationService.confirm({
      message: messageError,
      header: 'Warning',
      rejectLabel: 'Close',
      acceptVisible: false,
    });
    return throwError(error);
  }
}
