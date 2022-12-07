import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { UserService } from 'app/services/user.service';
import { USER_STATUS, PATH } from '../utils/constants';
import { environment } from './../../environments/environment';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  viewLogOutData: any;
  displayName: string;
  displayMainRegion: string;
  displayRecieveSMS: string;
  displayCurrentStatus: string;
  statusDropdownList = [
    { name: USER_STATUS.STAND_BY.TEXT, value: USER_STATUS.STAND_BY.CODE },
    { name: USER_STATUS.OFF_DUTY.TEXT, value: USER_STATUS.OFF_DUTY.CODE },
  ];
  status: any;
  currentStatus: any;
  loading = false;
  receivePlanSms: boolean = false;

  constructor(
    private userService: UserService,
    private auth: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.getViewLogOut();
    this.status = this.statusDropdownList[0];
  }

  async getViewLogOut() {
    try {
      this.loading = true;
      let res: any = await this.userService.getViewLogOut().toPromise();
      this.viewLogOutData = res.resultData;
      this.displayName =
        this.viewLogOutData.TTSUSER.firstname +
        ' ' +
        this.viewLogOutData.TTSUSER.lastname;
      this.displayRecieveSMS =
        this.viewLogOutData.TTSUSER.receivePlanSms === 'N'
          ? 'No (for Plan Job)'
          : 'Yes (for Plan Job)';
      this.displayMainRegion = this.viewLogOutData.TTSUSER.region.regionNameEn;
      this.displayCurrentStatus =
        this.viewLogOutData.TTSUSER.status === USER_STATUS.OFF_DUTY.CODE
          ? USER_STATUS.OFF_DUTY.TEXT
          : USER_STATUS.LOGIN.TEXT;
    } catch (e) {
    } finally {
      this.loading = false;
    }
  }

  async logout() {
    let isUpdatedLogoutProfile = false;
    let isLoggedInSAML = this.auth.isLoggedInSAML;
    try {
      this.loading = true;
      await this.userService
        .updateLogOutProfile(this.status.value, this.receivePlanSms ? 'Y' : 'N')
        .toPromise();
      isUpdatedLogoutProfile = true;
      if (this.auth.isLoggedInSAML) {
        let res: any = await this.auth.logoutSAML().toPromise();
        await this.auth.logout();
        window.location.href = res.resultData.url;
      } else {
        await this.auth.logout();
      }
    } catch (e) {
    } finally {
      this.loading = false;
      if (isUpdatedLogoutProfile) {
        await this.auth.logout();
        if (isLoggedInSAML) {
          this.router.navigate(['/']);
        }
      }
    }
  }

  cancel() {
    this.router.navigate([PATH.DESKTOP], { skipLocationChange: true });
  }
}
