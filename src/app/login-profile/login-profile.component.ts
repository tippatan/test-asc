import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng-lts/api';
import * as AlertMessageConstant from '../utils/alert-message.constant';
import * as Messages from '../utils/messages.constant';
import * as Constants from '../utils/constants';
import { AuthService } from './../services/auth.service';
import { UserService } from './../services/user.service';
import { Subscription } from 'rxjs';
import { LoadingService } from 'app/services/loading.service';

@Component({
  selector: 'app-login-profile',
  templateUrl: './login-profile.component.html',
  styleUrls: ['./login-profile.component.scss'],
})
export class LoginProfileComponent implements OnInit {
  formProfile: FormGroup;
  profileData: any;
  fullName: string;
  profileDropdownList: any[];
  nodeDropdownList: any[];
  errorText = '';
  selectedShift: boolean = false;
  loading: boolean;
  submitted: boolean;
  userStatusDropdownList = [
    {
      name: Constants.USER_STATUS.LOGIN.TEXT,
      value: Constants.USER_STATUS.LOGIN.CODE,
    },
    {
      name: Constants.USER_STATUS.OFF_DUTY.TEXT,
      value: Constants.USER_STATUS.OFF_DUTY.CODE,
    },
  ];
  loadingSubscription: Subscription;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private user: UserService,
    private messageService: MessageService,
    private loadingService: LoadingService
  ) {}

  async ngOnInit() {
    this.loading = true;
    this.formProfile = this.fb.group({
      profile: [null, Validators.required],
      userStatus: [null],
      shiftDay: [null],
      node: [null],
      remark: [{ value: null, disabled: true }],
      needReceiveSMS: null,
      goToActivityCalendar: [null],
    });

    this.user.getProfile().subscribe((data: any) => {
      if (data.status === 'success') {
        this.profileData = data.resultData;
        this.fullName =
          this.profileData.result.user.firstname +
          ' ' +
          this.profileData.result.user.lastname;
        this.profileDropdownList = data.resultData.result.profile;

        this.formProfile.controls['userStatus'].setValue(
          this.userStatusDropdownList[0]
        );
        if (this.profileData.result.authShiftDay) {
          this.nodeDropdownList = data.resultData.result.node;
          this.addControlShiftDay();
        }
        if (this.profileData.result.authWorkforce) {
          this.addControlSMS();
        }
        if (this.profileData.actmAuth) {
          this.addControlACTM();
        }
        this.setDefaultFormProfile();
      }
      this.loading = false;
      this.loadingSubscription = this.loadingService.loading$
        .pipe()
        .subscribe((res: boolean) => {
          this.loading = false;
        });
    });
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }

  addControlShiftDay() {
    this.formProfile.controls['shiftDay'].setValidators([Validators.required]);
  }

  addControlSMS() {
    this.formProfile.controls['needReceiveSMS'].reset();
  }

  addControlACTM() {
    this.formProfile.controls['goToActivityCalendar'].setValue(false);
  }

  setDefaultFormProfile() {
    this.submitted = false;
    this.formProfile.controls['profile'].patchValue(
      this.profileDropdownList.find(
        (x) => x.id === this.profileData.result.user.activeProfileId
      )
    );
    if (this.profileData.result.node !== null) {
      this.formProfile.controls['userStatus'].patchValue(
        this.userStatusDropdownList.find(
          (x) => x.value === Constants.USER_STATUS.LOGIN.CODE
        )
      );
    } else {
      this.formProfile.controls['userStatus'].patchValue(
        this.userStatusDropdownList.find(
          (x) => x.value === this.profileData.result.user.status
        )
      );
    }
    if (this.profileData.result.authShiftDay) {
      this.formProfile.controls['shiftDay'].patchValue('S');
      this.userStatusDropdownList.splice(1, 1);
      this.selectedShift = true;
    }
    if (this.profileData.result.user.receivePlanSms) {
      this.formProfile.controls['needReceiveSMS'].patchValue(
        this.profileData.result.user.receivePlanSms === 'Y'
      );
    }
    if (this.profileData.actmAuth) {
      this.formProfile.controls['goToActivityCalendar'].patchValue(
        this.profileData.result.user.directToACTM === 'Y'
      );
    }
  }

  showRemark() {
    this.formProfile.controls['remark'].patchValue(
      this.formProfile.controls['node'].value.description
    );
  }

  onLoginProfile() {
    this.loading = true;
    this.loadingSubscription = this.loadingService.loading$
      .pipe()
      .subscribe((res: boolean) => {
        this.loading = true;
      });
    this.submitted = true;
    if (this.formProfile.valid && !this.validateNode()) {
      this.auth.loginProfile(this.formProfile.value).subscribe(
        () => {
          if (this.formProfile.value.goToActivityCalendar) {
            this.loading = false;
            this.router.navigate([Constants.PATH.ACTIVITY_CALENDAR], {
              skipLocationChange: true,
            });
          } else {
            this.loading = false;
            this.router.navigate([Constants.PATH.DESKTOP], {
              skipLocationChange: true,
            });
          }
        },
        (error) => {
          console.log(error);
          this.errorText = Messages.SYSTEM_ERROR;
        }
      );
    } else {
      this.loading = false;
      this.formProfile.controls['node'].markAsTouched();
    }
  }

  validateNode() {
    return (
      this.formProfile.controls['node'].value === null &&
      this.formProfile.controls['shiftDay'].value === 'S'
    );
  }

  validator(controlName: string): boolean {
    let control = this.formProfile.controls[controlName];
    if (controlName === 'node') {
      return this.validateNode() && (control.touched || control.dirty);
    }
    return control.invalid && (control.touched || control.dirty);
  }
}
