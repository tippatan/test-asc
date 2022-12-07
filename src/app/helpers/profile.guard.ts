import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import * as Constants from '../utils/constants';

@Injectable({
  providedIn: 'root',
})
export class ProfileGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (state.url.startsWith('/cp-mass') || state.url === '/query/cp') {
      return true;
    } else if (
      this.auth.isLoggedInProfile &&
      this.auth.initFromLoginSubject.value
    ) {
      return true;
    } else {
      this.router.navigate([Constants.PATH.LOGIN_PROFILE], {
        skipLocationChange: true,
      });
      return false;
    }
  }
}
