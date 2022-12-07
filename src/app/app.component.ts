import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import * as Icon from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { BreadcrumbService } from './services/breadcrumb.service';
import { UserService } from './services/user.service';
import * as Constants from './utils/constants';
import * as MessagesConstant from './utils/messages.constant';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title: string = 'Trouble Ticket System';
  mainMenuItems: any;
  leftMenuItems: any[];
  icon = Icon;
  isOpenSidenav = true;
  isLoginPage = true;
  isLogoutPage = false;
  profile: any;
  viewChangeProfile: any;
  nodeObj: any;
  modeShiftDay: any;
  authMenu: any = {
    AUTHEN_IT_SERVICEDESK: false,
  };
  listPrivateNews: any = {};
  loadingSubscription: Subscription;
  loading: boolean;
  leftMenuLoading: boolean;
  toggleSlide: boolean = false;
  interval: any;
  check_help_report: boolean = false;

  constructor(
    private router: Router,
    private auth: AuthService,
    private user: UserService,
    private location: Location,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
    clearInterval(this.interval);
  }

  onLogout() {
    this.router.navigate([Constants.PATH.LOGOUT], { skipLocationChange: true });
  }
}
