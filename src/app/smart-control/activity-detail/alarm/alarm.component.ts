import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { SmartcontrolUtilService } from 'app/services/smartcontrol-util.service';
import { SmartcontrolConfirmMessageModel } from 'app/smart-control/shares/component/smartcontrol-confirm-dialog/smartcontrol-confirm-message-model';
import { ConfirmationService, MessageService } from 'primeng-lts/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-alarm',
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.scss', './../../smart-control.component.scss'],
})
export class AlarmComponent implements OnInit, OnDestroy {
  @Input() activityDetailObj: any;
  @Input() dataMaster: any;
  @Output() onCallBackAction = new EventEmitter();
  alarmType: string = 'Site Code';
  isAlarmSiteCode: boolean = false;
  isAlarmService: boolean = false;
  isAlarmEnterprise: boolean = false;
  alarmNote: string;

  dataTableAlarmValue: any = {
    rowList: new Array(),
    pageSizeList: [10000],
    canSaveActivity: 'N',
    lastChkAlm: '-'
  };

  loading: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private smartcontrolUtil: SmartcontrolUtilService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.alarmType = 'Site Code';
    this.isAlarmSiteCode = true;
    if (this.activityDetailObj) {
      this.dataTableAlarmValue.canSaveActivity =
        this.dataMaster.controlDetail.canSaveActivity;
      if (this.alarmType === 'Site Code') {
        this.dataTableAlarmValue.rowList =
          this.activityDetailObj.listAlarmSiteCode;
        this.dataTableAlarmValue.alarmType = this.alarmType;
      }

      // console.log(' alarm componenet ngOnInit this.activityDetailObj.alarmLastCheck : ',this.activityDetailObj.alarmLastCheck,this.activityDetailObj.alarmLastCheck)
      if(this.activityDetailObj.alarmLastCheck){
        if(this.alarmType === 'Site Code'){
          this.dataTableAlarmValue.lastChkAlm = this.activityDetailObj.alarmLastCheck.lastChkAlmSitecode;
        }else if(this.alarmType === 'Service'){
          this.dataTableAlarmValue.lastChkAlm = this.activityDetailObj.alarmLastCheck.lastChkAlmService;
        }else if(this.alarmType === 'Enterprise'){
          this.dataTableAlarmValue.lastChkAlm = this.activityDetailObj.alarmLastCheck.lastChkAlmEds;
        }
      }
    }
    this.onCheckEnableTab();
  }

  ngDoCheck(): void {
    // console.log(' alarm componenet ngDoCheck this.activityDetailObj.alarmLastCheck : ',this.activityDetailObj.alarmLastCheck,this.activityDetailObj.alarmLastCheck)
    if (
      (this.alarmType === 'Site Code' &&
        this.dataTableAlarmValue.rowList !=
          this.activityDetailObj.listAlarmSiteCode) ||
      (this.alarmType === 'Service' &&
        this.dataTableAlarmValue.rowList !=
          this.activityDetailObj.listAlarmService) ||
      (this.alarmType === 'Enterprise' &&
        this.dataTableAlarmValue.rowList !=
          this.activityDetailObj.listAlarmEnterprise)
    ) {
      this.onSetDataTable();
    }

    if(this.alarmType === 'Site Code' && (this.dataTableAlarmValue.lastChkAlm != this.activityDetailObj.alarmLastCheck.lastChkAlmSitecode)){
      this.dataTableAlarmValue.lastChkAlm = this.activityDetailObj.alarmLastCheck.lastChkAlmSitecode;
    }else if(this.alarmType === 'Service' && (this.dataTableAlarmValue.lastChkAlm != this.activityDetailObj.alarmLastCheck.lastChkAlmService)){
      this.dataTableAlarmValue.lastChkAlm = this.activityDetailObj.alarmLastCheck.lastChkAlmService;
    }else if(this.alarmType === 'Enterprise' && (this.dataTableAlarmValue.lastChkAlm != this.activityDetailObj.alarmLastCheck.lastChkAlmEds)){
      this.dataTableAlarmValue.lastChkAlm = this.activityDetailObj.alarmLastCheck.lastChkAlmEds;
    }
  }

  onSetDataTable() {
    // console.log('onSetDataTable : ',this.activityDetailObj.listAlarmSiteCode,this.activityDetailObj.listAlarmService,this.activityDetailObj.listAlarmEnterprise);
    this.dataTableAlarmValue = {
      rowList: new Array(),
      pageSizeList: [10000],
      canSaveActivity: this.dataMaster.controlDetail.canSaveActivity,
      alarmType: this.alarmType,
    };
    if (this.activityDetailObj) {
      if (this.alarmType === 'Site Code') {
        this.dataTableAlarmValue.rowList =
          this.activityDetailObj.listAlarmSiteCode;
      } else if (this.alarmType === 'Service') {
        this.dataTableAlarmValue.rowList =
          this.activityDetailObj.listAlarmService;
      } else if (this.alarmType === 'Enterprise') {
        this.dataTableAlarmValue.rowList =
          this.activityDetailObj.listAlarmEnterprise;
      }
    }
  }

  onCheckEnableTab() {
    // console.log('onCheckEnableTab : ',this.activityDetailObj.listAlarmSiteCode,this.activityDetailObj.listAlarmService,this.activityDetailObj.listAlarmEnterprise);
    // console.log('onCheckEnableTab  length : ',this.activityDetailObj.listAlarmSiteCode.length,this.activityDetailObj.listAlarmService.length,this.activityDetailObj.listAlarmEnterprise.length);
    // if (this.activityDetailObj.listAlarmSiteCode && this.activityDetailObj.listAlarmSiteCode.length > 0) {
      // console.log('onCheckEnableTab : 1');
      // this.isAlarmSiteCode = true;
    // }
    // if (this.activityDetailObj.listAlarmService && this.activityDetailObj.listAlarmService.length > 0) {
    if (this.dataMaster.controlDetail.serviceDisplay) {
      // console.log('onCheckEnableTab : 2');
      this.isAlarmService = true;
    }
    // if (this.activityDetailObj.listAlarmEnterprise && this.activityDetailObj.listAlarmEnterprise.length > 0) {
    if (this.activityDetailObj.serviceEDS && this.activityDetailObj.serviceEDS.length > 0) {
      // console.log('onCheckEnableTab : 3');
      this.isAlarmEnterprise = true;
    }
  }

  onClickAlarmType(type) {
    if (type) {
      this.alarmType = type;
      this.activityDetailObj.alarmType = type;
      this.dataTableAlarmValue.alarmType = type;
      this.onSetDataTable();

      if(this.activityDetailObj.alarmLastCheck){
        if(this.alarmType === 'Site Code'){
          this.dataTableAlarmValue.lastChkAlm = this.activityDetailObj.alarmLastCheck.lastChkAlmSitecode;
        }else if(this.alarmType === 'Service'){
          this.dataTableAlarmValue.lastChkAlm = this.activityDetailObj.alarmLastCheck.lastChkAlmService;
        }else if(this.alarmType === 'Enterprise'){
          this.dataTableAlarmValue.lastChkAlm = this.activityDetailObj.alarmLastCheck.lastChkAlmEds;
        }
      }
      
      this.callBackAction(type, 'test');
    }
  }

  onClickNote() {
    let subConfirm = new SmartcontrolConfirmMessageModel();
    if (this.alarmType === 'Site Code') {
      subConfirm.title = 'Site Code Note';
      subConfirm.commentResult = this.activityDetailObj.alarmSiteCodeNote;
    } else if (this.alarmType === 'Service') {
      subConfirm.title = 'Service Note';
      subConfirm.commentResult = this.activityDetailObj.alarmServiceNote;
    } else if (this.alarmType === 'Enterprise') {
      subConfirm.title = 'Enterprise Note';
      subConfirm.commentResult = this.activityDetailObj.alarmEnterpriseNote;
    }
    subConfirm.commentTitle = 'Note ';
    subConfirm.btnCancelName = 'Cancel';
    subConfirm.commentShow = 'show';

    this.smartcontrolUtil
      .confirmDialog(subConfirm, true)
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result) => {
          if (result.isConfirm) {
            this.loading = true;
            if (this.alarmType === 'Site Code') {
              this.activityDetailObj.alarmSiteCodeNote = result.commentResult;
              this.dataMaster.controlDetail.alarmSiteCodeNote = null;
            } else if (this.alarmType === 'Service') {
              this.activityDetailObj.alarmServiceNote = result.commentResult;
              this.dataMaster.controlDetail.alarmServiceNote = null;
            } else if (this.alarmType === 'Enterprise') {
              this.activityDetailObj.alarmEnterpriseNote = result.commentResult;
              this.dataMaster.controlDetail.alarmEnterpriseNote = null;
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Draft',
              detail: 'Edit note success!',
            });
            this.loading = false;
          }
        },
        (error) => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error,
          });
        }
      );
  }

  callBackAction(data, actionCallBack) {
    let param = { data: data, actionCallBack: actionCallBack };
    this.onCallBackAction.emit(param);
  }

  onTblCallBackAction(data) {
    console.log('onTblCallBackAction data : ' + data);
    this.onCallBackAction.emit(data);
  }
}
