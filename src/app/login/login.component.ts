import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { LoadingService } from 'app/services/loading.service';
import { SmartControlDataService } from 'app/services/smart-control-data.service';
import { WebsocketService } from 'app/web-socket.service';
import { Subscription } from 'rxjs';
import * as Constants from '../utils/constants';
import * as Messages from '../utils/messages.constant';
import { AuthService } from './../services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLogin: boolean = false;
  loading = false;
  loginUnsuccess: boolean = false;
  formLogin: FormGroup;
  errorText = '';
  isLoginSAMLPage = false;
  token: string;
  isSAML = false;
  formProfile: FormGroup;
  loadingSubscription: Subscription;
  submitted: boolean;
  profile: any;
  channel: string;
  terminal: string;
  userName: string;
  wrId: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute,
    // private loadingService: LoadingService,
    // private dataService: SmartControlDataService,
    private socketService: WebsocketService
  ) {
    this.route.queryParams.subscribe((params: ParamMap) => {
      if (params['data']) {
        let param = params['data'];
        console.log('login init param : ', param);
        let decodeParam = JSON.parse(atob(param));

        console.log('------------------decodeParam :', decodeParam);
        console.log('------------------channel :', decodeParam.channel);
        console.log('------------------terminal :', decodeParam.terminal);
        console.log('------------------userName :', decodeParam.userName);
        console.log('------------------wrId :', decodeParam.wrId);

        this.channel = decodeParam.channel;
        this.terminal = decodeParam.terminal;
        this.userName = decodeParam.userName;
        this.wrId = decodeParam.wrId;
      }

      console.log('------------------token :', params['token']);
      console.log('------------------isSAML :', params['isSAML']);
      console.log('------------------profile :', params['profile']);

      this.token = params['token'];
      this.isSAML = params['isSAML'];
      // this.profile = params['profile'];
      if (params['profile'])
        // this.profile = decodeURIComponent(params['profile'])
        this.profile = params['profile'];

      console.log('------------------profile decode :', this.profile);
    });
    /* console.log('------------------====================-------------------');
    this.route.queryParams.subscribe((params) => {
      console.log('------------------token :',params['token']);
      console.log('------------------isSAML :', params['isSAML'] );
      console.log('------------------profile :', params['profile'] );
      console.log('------------------channel :', params['channel'] );
      console.log('------------------terminal :', params['terminal'] );
      console.log('------------------userName :', params['userName'] );
      console.log('------------------wrId :', params['wrId'] );
      
      this.token = params['token'];
      this.isSAML = params['isSAML'] === 'true';
      this.profile = params['profile']
      this.channel = params['channel']
      this.terminal = params['terminal']
      this.userName = params['userName']
      this.wrId = params['wrId']
    });*/
  }

  async ngOnInit() {
    if (localStorage.profile) {
      this.socketService.close();
      sessionStorage.clear();
      localStorage.clear();
    }

    // console.log('localStorage ==> ',localStorage);
    this.route.data.subscribe((data) => {
      console.log('------------------ngOnInit data :', data);
      this.isLoginSAMLPage = !!data.isLoginSAMLPage;
    });

    this.formLogin = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
      isExternal: ['N'],
    });

    try {
      if (this.token) {
        await this.loginWithToken();
        this.auth.isLoggedInSAML = this.isSAML;
      }

      if (this.channel === 'tts') {
        // this.formLogin['username'] = this.userName;
        // this.formLogin['password'] = this.channel;
        this.formLogin = this.fb.group({
          username: this.userName,
          password: this.channel,
          isExternal: 'Y',
        });
        await this.onLogin();
      }
    } catch (e) {}
  }

  async loginWithToken() {
    await this.auth.loginWithToken(this.token);
    // this.router.navigate([Constants.PATH.LOGIN_PROFILE]);
    localStorage.setItem('profile', this.profile);
    this.router.navigate([Constants.PATH.SMART_CONTROL], {
      skipLocationChange: false,
    });
  }

  onLogin() {
    if (this.isLoginSAMLPage) {
      window.location.href = Constants.PATH.SAML;
    } else {
      this.isLogin = true;
      if (this.formLogin.invalid) {
        return;
      }
      if (!this.isLoginSAMLPage) {
        this.loading = true;
        this.auth.login(this.formLogin.value).subscribe(
          () => {
            this.loading = false;
            if (!this.auth.isLoggedIn) {
              this.errorText = Messages.USSPSS_INCORRECT;
              this.loginUnsuccess = true;
              return;
            }

            if (this.channel !== 'asc' && this.terminal) {
              if (this.terminal == Constants.PATH.ACTIVITY_DETAIL) {
                this.gotoActivityDetail();
              } else {
                this.router.navigate(
                  [Constants.PATH.SMART_CONTROL + '/' + this.terminal],
                  {
                    skipLocationChange: false,
                  }
                );
              }
            } else {
              this.router.navigate([Constants.PATH.SMART_CONTROL], {
                skipLocationChange: false,
              });
            }
          },
          (error) => {
            if (error.error?.errorMessage) {
              this.errorText = error.error?.errorMessage;
            } else {
              this.errorText = Messages.SYSTEM_ERROR;
            }
            this.loginUnsuccess = true;
            this.loading = false;
          }
        );
      }
    }
  }

  validator(controlName: string): boolean {
    let control = this.formLogin.controls[controlName];
    return this.isLogin && control.invalid;
  }

  // onLoginProfile() {
  //   this.loading = true

  //   this.loading = true
  //   this.formProfile = this.fb.group({
  //     profile: [null, Validators.required],
  //     userStatus: [null],
  //     shiftDay: [null],
  //     node: [null],
  //     remark: [{value: null, disabled: true}],
  //     needReceiveSMS: null,
  //     goToActivityCalendar: [null]
  //   });

  //   console.log('=================onLoginProfile()=================',);
  //   console.log('=================onLoginProfile()=================');

  //   this.loadingSubscription = this.loadingService.loading$.pipe().subscribe((res: boolean) => { this.loading = true });
  //   this.submitted = true
  //   if (this.formProfile.valid ) {
  //     this.auth.loginProfile(this.formProfile.value)
  //       .subscribe(
  //         () => {
  //           this.router.navigate([Constants.PATH.SMART_CONTROL], {
  //             skipLocationChange: false,
  //           });
  //           // if (this.formProfile.value.goToActivityCalendar) {
  //           //   this.loading = false
  //           //   this.router.navigate([Constants.PATH.ACTIVITY_CALENDAR], { skipLocationChange: true });
  //           // } else {
  //           //   this.loading = false
  //           //   this.router.navigate([Constants.PATH.DESKTOP], { skipLocationChange: true });
  //           // }
  //         },
  //         error => {
  //           console.log(error)
  //           this.errorText = Messages.SYSTEM_ERROR;
  //         }
  //       )
  //   } else {
  //     this.loading = false
  //     this.formProfile.controls['node'].markAsTouched()
  //   }
  // }

  gotoActivityDetail() {
    let actparam = {
      wrId: this.wrId,
    };
    console.log('gotoActivityDetail actparam : ', this.wrId, actparam);
    let paramUri = 'data=' + btoa(JSON.stringify(actparam));
    // this.dataService.openLink('/smart-control/activity-detail',actparam);
    window.location.href =
      Constants.PATH.SMART_CONTROL +
      '/' +
      this.terminal +
      '?' +
      encodeURI(paramUri);
  }
}
