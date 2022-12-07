import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  catchError,
  filter,
  finalize,
  retry,
  switchMap,
  take,
} from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  private refreshTokenInProgress = false;
  constructor(private auth: AuthService) {}

  initRequest(request: HttpRequest<unknown>) {
    if (this.auth.isLoggedIn) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.auth.tokenValue}`,
        },
      });
    }
    return request;
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(this.initRequest(request)).pipe(
      catchError((error: any) => {
        if (error.status === 403) {
          if (this.refreshTokenInProgress) {
            return this.refreshTokenSubject.pipe(
              filter((result) => result !== null),
              take(1),
              switchMap(() => next.handle(this.initRequest(request)))
            );
          } else {
            this.refreshTokenInProgress = true;
            this.refreshTokenSubject.next(null);
            return this.auth.refreshToken().pipe(
              switchMap((success) => {
                this.refreshTokenSubject.next(success);
                return next.handle(this.initRequest(request));
              }),
              // When the call to refreshToken completes we reset the refreshTokenInProgress to false
              // for the next time the token needs to be refreshed
              finalize(() => (this.refreshTokenInProgress = false))
            );
          }
        }
        return throwError(error);
      })
    );
  }
}
