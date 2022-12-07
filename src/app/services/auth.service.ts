import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WebsocketService } from 'app/web-socket.service';
import jwt_decode from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginForm, LoginResponse } from '../models/login.model';
import * as Constants from '../utils/constants';
import * as Messages from '../utils/messages.constant';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenSubject: BehaviorSubject<any>;
  public initFromLoginSubject = new BehaviorSubject<boolean>(false);
  public token: Observable<any>;
  public initFromLogin: Observable<any>;
  isLoginSAML: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private socketService: WebsocketService
  ) {
    this.tokenSubject = new BehaviorSubject<LoginResponse>(
      JSON.parse(localStorage.getItem('token'))
    );
    this.token = this.tokenSubject.asObservable();
  }

  login(formLogin: LoginForm) {
    return this.http.post(`${environment.baseURL}/login-asc`, formLogin).pipe(
      map((user: any) => {
        if (user['status'] && user['status'] === Messages.STATUS_ERROR) {
          return;
        }
        localStorage.setItem(
          'token',
          JSON.stringify(user.resultData.result.token)
        );
        localStorage.setItem('loginProfileStatus', Messages.FALSE);
        user.lastLogin = new Date().toLocaleString('en-US');
        console.log('-=----------auth login----------------');
        console.log(' user : ', user);

        let profile = user.resultData.result;
        profile.lastLogin = new Date().toLocaleString('en-US', {
          day: 'numeric', // numeric, 2-digit
          month: 'numeric', // numeric, 2-digit, long, short, narrow
          year: 'numeric', // numeric, 2-digit
          hour: 'numeric', // numeric, 2-digit
          minute: 'numeric', // numeric, 2-digit
          second: 'numeric', // numeric, 2-digit
        });
        profile.exp = new Date(profile.exp).toLocaleString('en-US');
        console.log(' profile : ', profile);

        localStorage.setItem('profile', JSON.stringify(profile));

        this.tokenSubject.next(user.resultData.result.token);
      })
    );
  }

  loginProfile(formLogin: LoginForm) {
    localStorage.setItem('loginProfileStatus', Messages.SUCCESS);
    return this.http
      .post(`${environment.baseURL}/change-log-in-profile`, formLogin)
      .pipe(
        map((user) => {
          this.initFromLoginSubject.next(true);
          return user;
        })
      );
  }

  async logout(currentRoute: string = null) {
    let isLoggedInSAML = localStorage.getItem('isLoggedInSAML');

    if (currentRoute && !isLoggedInSAML) {
      this.router.navigate([currentRoute]);
    } else if (isLoggedInSAML) {
      localStorage.removeItem('isLoggedInSAML');
      this.router.navigate([Constants.PATH.LOGIN]);
    } else {
      this.router.navigate([Constants.PATH.LOGIN]);
    }
    this.socketService.close();
    sessionStorage.clear();
    localStorage.clear();
  }

  logoutSAML() {
    return this.http.post('/logout-saml', {});
  }

  async loginWithToken(token) {
    await localStorage.setItem('token', JSON.stringify(token));
    await this.tokenSubject.next(token);
  }

  refreshToken() {
    return this.http.post(`/refresh-token`, {}).pipe(
      map((user: any) => {
        if (user['status'] === Messages.STATUS_ERROR) {
          return;
        }
        localStorage.setItem('token', JSON.stringify(user.resultData.token));
        this.tokenSubject.next(user.resultData.token);
      })
    );
  }

  public get isLoggedInSAML() {
    return localStorage.getItem('isLoggedInSAML') === 'true';
  }

  public set isLoggedInSAML(isLoggedInSAML) {
    localStorage.setItem('isLoggedInSAML', isLoggedInSAML ? 'true' : 'false');
  }

  public get initFromLoginValue() {
    return this.initFromLogin;
  }

  public get isLoggedIn() {
    let token = JSON.parse(localStorage.getItem('token'));
    return token !== null;
  }

  public get isLoggedInProfile() {
    let loginProfileStatus = localStorage.getItem('loginProfileStatus');
    return loginProfileStatus === Messages.SUCCESS;
  }

  public get tokenValue(): any {
    return JSON.parse(localStorage.getItem('token'));
  }

  public get tokenValueDecode(): any {
    return jwt_decode(this.tokenSubject.value);
  }
}
