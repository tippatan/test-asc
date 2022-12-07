import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { PATH } from '../utils/constants';

@Injectable({
  providedIn: 'root',
})
export class LoginBypassGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (environment.production) {
      this.router.navigate([PATH.LOGIN_SAML]);
    }
    return !environment.production;
  }
}
