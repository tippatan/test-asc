import { LoginProfile } from './../models/login-profile.model';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getProfile() {
    return this.http.get(`${environment.baseURL}/view-login`);
  }

  getViewChangeLoginProfile() {
    return this.http.get(`${environment.baseURL}/view-change-login-profile`);
  }

  getViewLogOut() {
    return this.http.get(`${environment.baseURL}/view-log-out`);
  }

  updateLogOutProfile(status: string, receivePlanSms: string) {
    return this.http.post(`${environment.baseURL}/change-log-out-profile`, {
      status,
      receivePlanSms,
    });
  }
}
