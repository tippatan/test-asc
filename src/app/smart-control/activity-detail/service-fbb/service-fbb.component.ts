import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { SmartcontrolUtilService } from 'app/services/smartcontrol-util.service';
import { SmartcontrolConfirmMessageModel } from 'app/smart-control/shares/component/smartcontrol-confirm-dialog/smartcontrol-confirm-message-model';
import { MessageService } from 'primeng-lts/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-service-fbb',
  templateUrl: './service-fbb.component.html',
  styleUrls: [
    './service-fbb.component.scss',
    './../../smart-control.component.scss',
  ],
})
export class ServiceFbbComponent implements OnInit, OnDestroy {
  @Input() activityDetailObj: any;
  @Input() dataMaster: any;
  @Input() reload: any;
  @Output() onCallBackAction = new EventEmitter();

  dataTableFBBValue: any = {
    rowList: new Array(),
    canSaveActivity: 'N',
    pageSizeList: [10000],
    smsType: 'NONE',
    lastChkServiceFbb: '-'
  };

  loading: boolean = false;

  private destroy$ = new Subject<void>();

  smsType: string;

  listWRStatusCanSendSMSCompleteFlow: any = [
    'IN_PROGRESS',
    'TEST_MONITORING',
    'FALLBACK',
    'FALLBACK_WITH_ERROR',
    'COMPLETE',
    'COMPLETE_WITH_ERROR',
    'COMPLETE_CONDITION',
  ];

  listWRStatusCanSendSMSCancelFlow: any = [
    'CANCEL',
    'CANCEL_WITH_UNEXPECTED'
  ];

  constructor(
    private smartcontrolUtil: SmartcontrolUtilService,
    private messageService: MessageService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    // console.log('service-fbb.component ngOnInit this.activityDetailObj : ',this.activityDetailObj);
    
    if (this.activityDetailObj.serviceFBB) {
      this.dataTableFBBValue.rowList = this.activityDetailObj.serviceFBB;
      this.dataTableFBBValue.canSaveActivity =
        this.dataMaster.controlDetail.canSaveActivity;

      this.dataTableFBBValue.smsType = this.activityDetailObj.smsType;
      if(this.dataMaster.controlDetail){
        this.setActivityDetailObj()
      }
      this.dataTableFBBValue.reload = this.reload;
      if(this.activityDetailObj.serviceLastCheck){
        this.dataTableFBBValue.lastChkServiceFbb = this.activityDetailObj.serviceLastCheck.lastChkServiceFbb;
      }
    }
  }

  ngDoCheck(): void {
    if(this.dataTableFBBValue.lastChkServiceFbb != this.activityDetailObj.serviceLastCheck.lastChkServiceFbb){
      this.dataTableFBBValue.lastChkServiceFbb = this.activityDetailObj.serviceLastCheck.lastChkServiceFbb;
    }
  }
  
  ngOnChanges(changes: SimpleChanges): void {
   
    if (changes.activityDetailObj || changes.dataMaster) {
      // console.log('service-fbb.componet (changes.activityDetailObj || changes.dataMaster) ======>',changes.activityDetailObj);
      this.setActivityDetailObj();
    }

    if(changes.reload){
      // console.log('service-fbb.componet (changes.reload) ======>',changes.reload);
      // console.log('service-fbb.componet this.reload ======>',this.reload);
      this.dataTableFBBValue.rowList = this.reload;
    }
  }

  setActivityDetailObj() {
    if (this.activityDetailObj) {
      this.dataTableFBBValue.rowList = this.activityDetailObj.serviceFBB;
      this.dataTableFBBValue.canSaveActivity =
        this.dataMaster.controlDetail.canSaveActivity;

        this.dataTableFBBValue.smsType = this.activityDetailObj.smsType;
        this.dataTableFBBValue.reload = this.reload;

        if(!this.canSentSMSFbb(this.dataMaster.controlDetail)){
          this.dataTableFBBValue.smsType = 'NONE'
        }
    }
    console.log('service-fbb.componet setActivityDetailObj ======>',this.activityDetailObj
    ,this.dataTableFBBValue.rowList,this.dataTableFBBValue.reload );
  }

  callBackAction(data, actionCallBack) {
    // console.log(' callBackAction : ',data);
    let param = { data: data, actionCallBack: actionCallBack };
    this.onCallBackAction.emit(param);
  }

  onTblCallBackAction(data) {
    // console.log(' onTblCallBackAction : ',data);
    
    this.onCallBackAction.emit(data);
  }

  onClickNote() {
    let subConfirm = new SmartcontrolConfirmMessageModel();

    subConfirm.title = 'Service Fixed Broadband Note';
    subConfirm.commentTitle = 'Note: ';
    subConfirm.commentResult = this.activityDetailObj.serviceFbbNote;
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
            this.activityDetailObj.serviceFbbNote = result.commentResult;
            this.dataMaster.controlDetail.serviceFbbNote = null;
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

  canSentSMSFbb(item){
    // console.log('-----canSentSMSFbb ----');
    // console.log(this.listWRStatusCanSendSMS.includes(item.statusActivityId));
    // console.log(item.ainStatusId === '03');
    // console.log(item.fbbSumReport === 'Pass');
    // console.log('---------',(this.listWRStatusCanSendSMS.includes(item.statusActivityId) && item.ainStatusId === '03' && item.fbbSumReport === 'Pass'));
    return ((this.listWRStatusCanSendSMSCompleteFlow.includes(item.statusActivityId) || this.listWRStatusCanSendSMSCancelFlow.includes(item.statusActivityId))
    && item.ainStatusId === '03');
  }
}
