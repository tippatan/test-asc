import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'app/services/common.service';
import { LoadingService } from 'app/services/loading.service';
import { SmartControlService } from 'app/services/smart-control.service';
import { Utility } from 'app/utils/utility';
import { ConfirmationService, MessageService, SortMeta } from 'primeng-lts/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-smart-check',
  templateUrl: './smart-check.component.html',
  styleUrls: ['./smart-check.component.scss', '../../../style/asc-theme.scss'],
})
export class SmartCheckComponent implements OnInit {
  panelOpenState = true;
  alarmType: string;
  isAlarmSiteCode: boolean;
  isAlarmEnterprise: boolean;
  siteCode: string = '';
  alarmSelect: string = '';
  lastCheckAlarm: string = '-';
  lastCheckEnterprise: string = '-';
  lastCheckFbb: string = '-';
  countAlarm: string = '0';
  countEnterprise: string = '0';
  countFbb: string = '0';

  dataListAlarm: any = {
    rowList: [],
  };
  dataAlarmSiteCode: any = [];
  dataAlarmEnterprise: any = [];
  dataLastCheckAlarmSiteCode: string = '';
  dataLastCheckAlarmEnterprise: string = '';

  dataTableEnterpriseValue: any = {
    rowList: new Array(),
    pageSizeList: [10000],
  };

  dataTableFBBValue: any = {
    rowList: new Array(),
    pageSizeList: [10000],
  };

  // loading
  loading: boolean = false;
  loadingSubscription: Subscription;

  types: any;
  selectedType: string;

  loginUsername: string = '';
  loginUserId: String = '';
  constructor(
    private smartControlService: SmartControlService,
    private loadingService: LoadingService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private router: Router,
    private commonService: CommonService,
    private confirmationService: ConfirmationService,
    private utility: Utility
  ) {
    this.types = [
      { label: 'Site Code', value: 'SITECODE' },
      { label: 'Enterprise', value: 'EDS' },
    ];
  }

  async ngOnInit() {
    this.alarmType = null;
    this.isAlarmSiteCode = false;
    this.isAlarmEnterprise = false;
    let parseProfile = JSON.parse(localStorage.profile);
    this.loginUsername = parseProfile.name;
    this.loginUserId = parseProfile.id ? parseProfile.id : parseProfile.pid;
  }

  async onClickSmartCheckQuery() {
    if (this.siteCode.replace(/\s/g, '') == '') {
      this.confirmationService.confirm({
        message: 'Please enter site code.',
        rejectLabel: 'Close',
        rejectButtonStyleClass: 'p-button-warning',
        key: 'warningDialog',
        acceptVisible: false,
      });
      return;
    }

    this.loading = true;

    this.dataListAlarm = {
      rowList: [],
    };

    this.dataTableEnterpriseValue = {
      rowList: [],
    };

    this.dataTableFBBValue = {
      rowList: [],
    };

    this.countAlarm = '';
    this.countEnterprise = '';
    this.countFbb = '';
    this.isAlarmSiteCode = false;
    this.isAlarmEnterprise = false;

    let dataList = [];
    dataList.push(this.siteCode);
    let dataObj = {
      siteCodeList: dataList,
    };
    this.smartControlService
      .smartCheckQuery(dataObj)
      .takeWhile((alive) => true)
      .subscribe(
        async (data) => {
          const result = data;
          if (result && result.resultCode === '0') {
            this.alarmType = 'SITECODE';
            this.alarmSelect = 'Site Code';
            this.isAlarmSiteCode =
              result.resultData.smartCheckAlarmSiteCode == 'Y' ? true : false;
            this.isAlarmEnterprise =
              result.resultData.smartCheckAlarmEnterprise == 'Y' ? true : false;

            this.dataTableEnterpriseValue = {
              rowList: result.resultData.smartCheckEnterpriseList,
            };
            this.countEnterprise =
              result.resultData.smartCheckEnterpriseList.length;

            this.dataTableFBBValue = {
              rowList: result.resultData.smartCheckFBBList,
            };
            this.countFbb = result.resultData.smartCheckFBBList.length;

            this.dataLastCheckAlarmSiteCode = '';
            this.dataLastCheckAlarmEnterprise = '';
            this.lastCheckAlarm = '-';

            this.loading = false;
          } else {
            this.loading = false;
            this.alarmSelect = '';
            this.confirmationService.confirm({
              message: result.resultMessage,
              rejectLabel: 'Close',
              rejectButtonStyleClass: 'p-button-warning',
              key: 'errorDialog',
              acceptVisible: false,
            });
            this.isAlarmSiteCode = false;
            this.isAlarmEnterprise = false;
          }
        },
        (error) => {
          // this.lockScreen.unLockScreen();
          this.loading = false;
        }
      );
  }

  onClickAlarmType(type) {
    if (type) {
      this.alarmType = type;
      if (this.alarmType == 'SITECODE') {
        this.alarmSelect = 'Site Code';
        this.dataListAlarm = {
          rowList: this.dataAlarmSiteCode,
        };
        this.lastCheckAlarm = this.dataLastCheckAlarmSiteCode;
      } else if (this.alarmType == 'EDS') {
        this.alarmSelect = 'Enterprise';
        this.dataListAlarm = {
          rowList: this.dataAlarmEnterprise,
        };
        this.lastCheckAlarm = this.dataLastCheckAlarmEnterprise;
      }
      this.countAlarm = this.dataListAlarm.rowList.length;
    }
  }

  onAlarmCheck() {
    this.loading = true;
    let dataList = [];
    dataList.push(this.siteCode);

    let dataObj = {
      alarmType: this.alarmType,
      siteCodeList: dataList,
    };
    this.smartControlService
      .smartCheckAlarm(dataObj)
      .takeWhile((alive) => true)
      .subscribe(
        async (data) => {
          const result = data;
          if (result && result.resultCode === '0') {
            if (this.alarmType == 'SITECODE') {
              this.dataAlarmSiteCode = result.resultData;
              this.dataLastCheckAlarmSiteCode = formatDate(
                new Date(),
                'dd/MM/yyyy HH:mm',
                'en-US'
              );
              this.lastCheckAlarm = this.dataLastCheckAlarmSiteCode;
            } else if (this.alarmType == 'EDS') {
              this.dataAlarmEnterprise = result.resultData;
              this.dataLastCheckAlarmEnterprise = formatDate(
                new Date(),
                'dd/MM/yyyy HH:mm',
                'en-US'
              );
              this.lastCheckAlarm = this.dataLastCheckAlarmEnterprise;
            }

            this.dataListAlarm = {
              rowList: result.resultData,
            };
            this.countAlarm = result.resultData.length;

            this.loading = false;
          } else {
            this.loading = false;
            this.confirmationService.confirm({
              message: result.resultMessage,
              rejectLabel: 'Close',
              rejectButtonStyleClass: 'p-button-warning',
              key: 'errorDialog',
              acceptVisible: false,
            });
          }
        },
        (error) => {
          this.loading = false;
        }
      );
  }

  onCallBackAction(param) {
    if (param.actionCallBack === 'ENTERPRISEALL') {
      this.smartCheckEnterprise(param.data);
    } else if (param.actionCallBack === 'ENTERPRISE') {
      let dataList = [];
      dataList.push(param.data);
      this.smartCheckEnterprise(dataList);
    } else if (param.actionCallBack === 'FBBALL') {
      this.smartCheckFbb(param.data);
    } else if (param.actionCallBack === 'FBB') {
      let dataList = [];
      dataList.push(param.data);
      this.smartCheckFbb(dataList);
    }
  }

  smartCheckEnterprise(data) {
    this.loading = true;
    let dataList = [];

    for (let i = 0; i < data.length; i++) {
      if (data[i].productType === 'CORP_EDS') {
        dataList.push(data[i].customerId);
      }
    }

    let dataObj = {
      userName: this.loginUsername,
      userId: this.loginUserId,
      enterpriseList: dataList,
    };

    this.smartControlService
      .smartCheckEnterprise(dataObj)
      .takeWhile((alive) => true)
      .subscribe(
        async (dataResult) => {
          const result = dataResult;
          if (result && result.resultCode === '0') {
            for (let i = 0; i < data.length; i++) {
              for (let j = 0; j < result.resultData.length; j++) {
                if (data[i].customerId === result.resultData[j].nonMobile) {
                  data[i].chkEnterpriseFlag =
                    result.resultData[j].chkEnterpriseFlag;
                }
              }
              this.messageService.add({
                severity: 'success',
                summary: 'success',
                detail: '',
                key: 'successMsg',
              });
            }
          } else {
            for (let i = 0; i < data.length; i++) {
              data[i].result = '';
            }

            this.confirmationService.confirm({
              message: result.resultMessage,
              header: 'Error',
              icon: 'pi pi-exclamation-triangle',
              rejectLabel: 'Close',
              rejectButtonStyleClass: 'p-button-warning',
              key: 'warningDialog',
              acceptVisible: false,
            });
          }
          this.lastCheckEnterprise = formatDate(
            new Date(),
            'dd/MM/yyyy HH:mm',
            'en-US'
          );
          this.loading = false;
        },
        (error) => {
          this.confirmationService.confirm({
            message: error.message,
            header: 'Error',
            icon: 'pi pi-exclamation-triangle',
            rejectLabel: 'Close',
            rejectButtonStyleClass: 'p-button-warning',
            key: 'errorDialog',
            acceptVisible: false,
          });
          this.loading = false;
        }
      );
  }

  smartCheckFbb(data) {
    this.loading = true;
    for (let i = 0; i < data.length; i++) {
      let dataObj = {
        accessNode: data[i].accessNode,
        pon: data[i].ponNo,
        splitterName: data[i].splitterFullName,
      };

      this.smartControlService
        .smartCheckFBB(dataObj)
        .takeWhile((alive) => true)
        .subscribe(
          async (dataResult) => {
            const result = dataResult;
            if (result && result.resultCode === '0') {
              data[i].countAll = result.resultData.countAll;
              data[i].countOnline = result.resultData.countOnline;
              this.lastCheckFbb = formatDate(
                new Date(),
                'dd/MM/yyyy HH:mm',
                'en-US'
              );
              this.loading = false;
            } else {
              data[i].countAll = '0';
              data[i].countOnline = '0';

              this.loading = false;
            }
          },
          (error) => {
            this.loading = false;
          }
        );

      if (i == data.length) {
        this.loading = false;
      }
    }
  }

  singleAlert(severity, summary, detail) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
    });
  }

  multiAlert() {
    this.messageService.addAll([
      {
        severity: 'success',
        summary: 'Service Message',
        detail: 'Via MessageService',
      },
      {
        severity: 'info',
        summary: 'Info Message',
        detail: 'Via MessageService',
      },
    ]);
  }

  clearAlert() {
    this.messageService.clear();
  }

  handleAlarmTypeChange(alarmType) {
    this.alarmType = alarmType;
  }
}
