import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfile } from 'app/models/userProfile';
import { AuthService } from 'app/services/auth.service';
import { SmartControlDataService } from 'app/services/smart-control-data.service';
import { SmartControlService } from 'app/services/smart-control.service';
import { SmartcontrolUtilService } from 'app/services/smartcontrol-util.service';
import { utimes } from 'fs';
import * as Constants from '../../utils/constants';
import { ConfirmationService, MessageService } from 'primeng-lts/api';
import { utils } from 'protractor';
import { SmartcontrolConfirmMessageModel } from '../shares/component/smartcontrol-confirm-dialog/smartcontrol-confirm-message-model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  title: string = 'User Profile';
  message: string = '';

  userProfile: UserProfile = new UserProfile();
  profile: any;
  listRoleGroup: any;

  private alive = true;
  loading: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private smartControlService: SmartControlService,
    private messageService: MessageService,
    private dataService: SmartControlDataService,
    private confirmationService: ConfirmationService,
    private smartcontrolUtil: SmartcontrolUtilService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.userProfile = JSON.parse(localStorage.profile);
    this.getASCUserProfile();
  }

  getASCUserProfile() {
    this.loading = true;
    this.smartControlService
      .getASCUserProfile(this.userProfile)
      .takeWhile((alive) => true)
      .subscribe(
        async (data) => {
          const result = data;
          if (result && result.resultCode === '0') {
            this.profile = result.resultData;
            this.listRoleGroup = this.profile.roleGroup.split(',');
            this.loading = false;
          } else {
            this.loading = false;
          }
        },
        (error) => {}
      );
  }

  clickSubmitRequest() {
    let subConfirm = new SmartcontrolConfirmMessageModel();
    subConfirm.type = 'warning';
    subConfirm.title = 'confirm submit request';
    subConfirm.message = 'Are you sure to submit this request ?';
    subConfirm.commentTitle = 'commentTitle...';
    subConfirm.commentResult = 'commentResult test set result ...';
    subConfirm.btnConfirmName = 'Are you sure?';
    subConfirm.btnConfirmShow = 'show';
    subConfirm.btnRejectName = 'Are you sure reject?';
    subConfirm.btnRejectShow = 'show';
    subConfirm.btnCancelName = 'Are you sure to Cancel ?';
    subConfirm.commentShow = 'show';
    subConfirm.requireComment = true;

    this.smartcontrolUtil
      .confirmDialog(subConfirm, true)
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result) => {
          if (result.isConfirm) {
            this.loading = true;
          }
        },
        (error) => {}
      );
  }

  onConfirmLogout() {
    this.confirmationService.confirm({
      header: 'Confirmation !',
      message: 'Are you sure that you want to logout?',
      accept: () => {
        this.logout();
        this.messageService.add({
          severity: 'success',
          summary: 'Confirmed',
          detail: 'Logout complete',
        });
      },
      key: 'confirmLogoutDialog',
    });
  }

  async logout() {
    let isUpdatedLogoutProfile = false;
    let isLoggedInSAML = this.authService.isLoggedInSAML;
    try {
      this.loading = true;
      isUpdatedLogoutProfile = true;
      if (this.authService.isLoggedInSAML) {
        let res: any = await this.authService.logoutSAML().toPromise();
        await this.authService.logout();
        window.location.href = res.resultData.url;
      } else {
        await this.authService.logout();
      }
    } catch (e) {
    } finally {
      this.loading = false;
      if (isUpdatedLogoutProfile) {
        await this.authService.logout();
        if (isLoggedInSAML) {
          this.router.navigate([Constants.PATH.LOGIN]);
        }
      }
    }
  }
}
