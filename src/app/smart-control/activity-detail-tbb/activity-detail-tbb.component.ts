import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ServiceFBB } from 'app/models/service-fbb';
import { AuthService } from 'app/services/auth.service';
import { SmartControlService } from 'app/services/smart-control.service';
import { TtsServiceService } from 'app/services/tts-service.service';
import { ConfirmationService, MessageService } from 'primeng-lts/api';
import { TimelineItem } from '../shares/component/timeline-horizontal/timeline-item';
import { Columns } from '../../shared-components/data-table2/models/columns';

@Component({
  selector: 'app-activity-detail-tbb',
  templateUrl: './activity-detail-tbb.component.html',
  styleUrls: ['./activity-detail-tbb.component.scss', '/src/app/smart-control/smart-control.component.scss']
})
export class ActivityDetailTbbComponent implements OnInit {
  loading: boolean = false;
  titleHeader: string;
  userProfile: any;
  reqData: any;
  wrId: string;
  wrStatus: string;
  dataMaster: any = {};
  items: TimelineItem[] = [];
  item: TimelineItem;
  serviceFBB: ServiceFBB;

  dataTableFBBValue: any = {
    rowList: [],
    columnList: [],
    canSaveActivity: 'N',
    pageSizeList: [10000],
    smsType: 'NONE',

  };

  columnListServiceFBB: Array<Columns> = [
    new Columns({ tagComponent: 'app-act-detail-fbb-tbb-tbl', isSortingDisplay: false, styleClass: 'w100' }),
    new Columns({ headerName: 'Ref ID', propertyName: 'refId' }),
    new Columns({ headerName: 'FBB ID', propertyName: 'fbbId', pipeName: 'customerAsterisk' }),
    // new Columns({
    //   headerName: 'Date Time',
    //   propertyName: 'alarmDate',
    //   propertySort: 'alarmDate',
    // }),
    new Columns({ headerName: 'Before', propertyName: 'fbbStatusBefore' }),
    new Columns({ headerName: 'After', propertyName: 'fbbStatusAfter' }),
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private smartControlService: SmartControlService,
    private ttsService: TtsServiceService,
    private authenService: AuthService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.userProfile = JSON.parse(localStorage.profile);
    this.authenService.refreshToken();
    this.activatedRoute.queryParams.subscribe((params: ParamMap) => {
      if (params['param'] || params['userLogin'] != '') {
        let param = params['data'];

        let decodeParam = JSON.parse(atob(param));
        this.reqData = decodeParam;
        this.wrId = this.reqData.wrId;
        // this.tabIndex = this.reqData.tabIndex ? this.reqData.tabIndex : '0';
      }
    });

    this.dataTableFBBValue.columnList = this.columnListServiceFBB;

    console.log('activity-detail-tbb onInit : ', this.reqData, this.wrId);
    this.getActivityDetail3BB();
    this.getActivityService3BB();
  }

  getActivityDetail3BB(): void {
    this.smartControlService.getActivityDetail3BB(this.wrId, this.userProfile.name).takeWhile((alive) => true).subscribe(
      async (data) => {
        const result = data;
        if (result && result.resultCode === '0') {
          this.dataMaster = result.resultData;

          this.titleHeader = this.dataMaster.controlDetail.title;
          this.wrStatus = this.dataMaster.controlDetail.statusActivityId;
          let objWrStatus = {
            statusId: this.dataMaster.controlDetail.statusActivityId,
          };

          this.dataMaster.controlDetail.node =
            this.dataMaster.controlDetail.node.split(',');
          this.dataMaster.controlDetail.nodeRelated =
            this.dataMaster.controlDetail.nodeRelated.split(',');

          if (this.dataMaster.historyList) {
            this.items = this.dataMaster.historyList.map((history) => history as TimelineItem);
          }

        }
      },
      (error) => {
        this.confirmationService.confirm({
          message: error.message,
          rejectLabel: 'Close',
          rejectButtonStyleClass: 'p-button-warning',
          key: 'errorDialog',
          acceptVisible: false,
        });
        this.loading = false;
      }
    );
  }

  getActivityService3BB(): void {
    this.loading = true;
    this.smartControlService
      .getActivityService3BB(this.wrId, this.userProfile.name)
      .takeWhile((alive) => true)
      .subscribe(
        async (data) => {
          const result = data;
          if (result && result.resultCode === '0') {
            if (result.resultData) {
              // this.activityDetailObj.listAlarmSiteCode =
              //   result.resultData.alarmSite;
              // this.activityDetailObj.listAlarmService =
              //   result.resultData.alarmService;
              // this.activityDetailObj.listAlarmEnterprise =
              //   result.resultData.alarmEDS;
              // this.activityDetailObj.serviceEDS = result.resultData.serviceEDS;
              this.serviceFBB = result.resultData.serviceFBB;
              // this.dataTableFBBValue.rowList = result.resultData.serviceFBB;

              this.dataTableFBBValue = {
                rowList: result.resultData.serviceFBB,
                columnList: this.columnListServiceFBB,
                pageSizeList: [10000]
              }

              this.serviceFBB
            }
            this.loading = false;
          }
        },
        (error) => {
          this.confirmationService.confirm({
            message: error.message,
            rejectLabel: 'Close',
            rejectButtonStyleClass: 'p-button-warning',
            key: 'errorDialog',
            acceptVisible: false,
          });
          this.loading = false;
        }
      );
  }

  onCallBackAction(data) {
    if (data) {
      if (data.actionCallBack == 'onCheckFBB') {
        // console.log('----------onCheckFBB data.data : ', data.data);
        this.activityCheckFBB(data.data);
      } else if (data.actionCallBack == 'onCheckAllFBB') {
        // console.log('----------onCheckAllFBB--: ', data.data);
        this.saveWRActivityFBB3BB(data.data);
      }
    }
  }

  doReloadActivity() {
    this.loading = true;

    let dataObj = {
      userName: this.userProfile.name,
      userId: this.userProfile.id ? this.userProfile.id : this.userProfile.pid,
      wrId: this.wrId,
      maintenanceId: this.wrStatus
    };
    console.log(' ......... reloadActivityDetail3BB dataObj: ', dataObj);
    this.smartControlService.reloadActivityDetail3BB(dataObj).takeWhile((alive) => true).subscribe(
        async (data) => {
          const result = data;
          this.getActivityDetail3BB();
          this.getActivityService3BB();
          if (result && result.resultCode === '0') {
            this.messageService.add({
              severity: 'success',
              summary: 'success',
              detail: '',
            });

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
          // this.loading = false;
        },
        (error) => {
          this.confirmationService.confirm({
            message: error,
            header: 'Error',
            icon: 'pi pi-exclamation-triangle',
            rejectLabel: 'Close',
            key: 'errorDialog',
            acceptVisible: false,
          });
          this.loading = false;
        }
      );
  }

  saveWRActivityFBB3BB(item): void {
    this.loading = true;

    let dataObj = {
      userName: this.userProfile.name,
      userId: this.userProfile.id ? this.userProfile.id : this.userProfile.pid,
      wrId: this.wrId,
      wrStatus: this.wrStatus,
      action: 'checkAllFbb',
    };
    // console.log(' ......... saveWRActivityFBB3BB dataObj: ', dataObj);
    this.smartControlService.saveWRActivityFBB3BB(dataObj).takeWhile((alive) => true).subscribe(
        async (data) => {
          const result = data;
          this.getActivityDetail3BB();
          this.getActivityService3BB();
          if (result && result.resultCode === '0') {
            this.messageService.add({
              severity: 'success',
              summary: 'success',
              detail: '',
            });

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
          // this.loading = false;
        },
        (error) => {
          this.confirmationService.confirm({
            message: error,
            header: 'Error',
            icon: 'pi pi-exclamation-triangle',
            rejectLabel: 'Close',
            key: 'errorDialog',
            acceptVisible: false,
          });
          this.loading = false;
        }
      );
  }

  async activityCheckFBB(param) {
    this.loading = true;
    // for (let i = 0; i < param.length; i++) {
    let obj = {
      id: param.id,
      refId: param.refId,
      fbbId: param.fbbId,
      userName: this.userProfile.name,
      userId: this.userProfile.id,
      wrId: this.wrId,
      wrStatus: this.wrStatus,
      action: 'checkAllFbb',
    };
    this.smartControlService.checkActivityDetailFBB3BB(obj).takeWhile((alive) => true).subscribe(async (data1) => {
      const result = data1;
      if (result) {
        if (result.resultCode === '0') {
          this.getActivityDetail3BB();
          this.getActivityService3BB();
          this.messageService.add({
            severity: 'success',
            summary: 'success',
            detail: '',
          });
          // this.loading = false;
        } else {
          this.loading = false;
          this.confirmationService.confirm({
            message: 'activityCheckFBB : ' + result.resultMessage,
            header: 'Error',
            icon: 'pi pi-exclamation-triangle',
            rejectLabel: 'Close',
            rejectButtonStyleClass: 'p-button-warning',
            key: 'warningDialog',
            acceptVisible: false,
          });
          this.loading = false;
        }
      }

    },
      (error) => {
        this.confirmationService.confirm({
          message: 'activityCheckFBB : ' + error.message,
          header: 'Error',
          icon: 'pi pi-exclamation-triangle',
          rejectLabel: 'Close',
          rejectButtonStyleClass: 'p-button-warning',
          key: 'warningDialog',
          acceptVisible: false,
        });
        this.loading = false;
      })
  }

}
