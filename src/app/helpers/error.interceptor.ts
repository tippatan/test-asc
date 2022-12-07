import { ErrorService } from './../services/error.service';
import { HTTP_CODE } from './../utils/constants';
import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng-lts/api';
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    private errorService: ErrorService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (
          err.status === HTTP_CODE.CONFLICT.CODE ||
          err.status === HTTP_CODE.UNAUTHORIZED.CODE
        ) {
          this.confirmationService.confirm({
            message: err.error.errorMessage,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'OK',
            rejectVisible: false,
          });
          this.auth.logout();
        } else if (err.status === HTTP_CODE.INTERNAL_SERVER_ERROR.CODE) {
          this.errorService.handleError(err);
        }
        return throwError(err);
      })
    );
  }
}
