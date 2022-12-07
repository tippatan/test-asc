import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './helpers/auth.guard';
import { ProfileGuard } from './helpers/profile.guard';
import { LoginProfileComponent } from './login-profile/login-profile.component';
import { LoginComponent } from './login/login.component';
import * as Constants from './utils/constants';
import { LogoutComponent } from './logout/logout.component';
import { LoginBypassGuard } from './helpers/login-bypass.guard';
import { MainUnitComponent } from './main-unit/main-unit.component';
const appRoutes: Routes = [
  {
    path: Constants.PATH.LOGIN_SAML,
    component: LoginComponent,
    data: { isLoginSAMLPage: true },
  },
  {
    path: Constants.PATH.LOGIN,
    component: LoginComponent,
    canActivate: [LoginBypassGuard],
  },
  {
    path: Constants.PATH.LOGIN_BYPASS,
    component: LoginComponent,
  },
  {
    path: Constants.PATH.LOGIN_EXTERNAL,
    component: LoginComponent,
  },
  {
    path: 'test',
    component: MainUnitComponent,
  },
  {
    path: Constants.PATH.LOGOUT,
    component: LogoutComponent,
    canActivate: [AuthGuard],
  },
  {
    path: Constants.PATH.SMART_CONTROL,
    loadChildren: () =>
      import('./smart-control/smart-control.module').then(
        (m) => m.SmartControlModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: Constants.PATH.LOGOUT,
    component: LogoutComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { useHash: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
