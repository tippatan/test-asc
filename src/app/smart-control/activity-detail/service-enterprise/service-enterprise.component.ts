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
import { MessageService } from 'primeng-lts/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-service-enterprise',
  templateUrl: './service-enterprise.component.html',
  styleUrls: [
    './service-enterprise.component.scss',
    './../../smart-control.component.scss',
  ],
})
export class ServiceEnterpriseComponent implements OnInit, OnDestroy {
  @Input() activityDetailObj: any;
  @Input() dataMaster: any;
  @Output() onCallBackAction = new EventEmitter();

  dataTableEnterpriseValue: any = {
    rowList: new Array(),
    canSaveActivity: 'N',
    pageSizeList: [10000],
    limitEDS: 0,
    countServiceL3: 0,
    lastChkServiceEds: '-'
  };

  enterpriseNote: string;

  loading: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private smartcontrolUtil: SmartcontrolUtilService,
    private messageService: MessageService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    // console.log('EDS activityDetailObj', this.activityDetailObj);
    if (this.activityDetailObj.serviceEDS) {
      this.dataTableEnterpriseValue.rowList = this.activityDetailObj.serviceEDS;
      this.dataTableEnterpriseValue.limitEDS = this.activityDetailObj.limitEDS;
      this.dataTableEnterpriseValue.countServiceL3 = this.activityDetailObj.countServiceL3;
      this.dataTableEnterpriseValue.canSaveActivity =
        this.dataMaster.controlDetail.canSaveActivity;
      if(this.activityDetailObj.serviceLastCheck){
        this.dataTableEnterpriseValue.lastChkServiceEds = this.activityDetailObj.serviceLastCheck.lastChkServiceEds;
      }
    }
  }

  ngDoCheck(): void {
    this.dataTableEnterpriseValue.rowList = this.activityDetailObj.serviceEDS;
   
    this.dataTableEnterpriseValue.limitEDS = this.activityDetailObj.limitEDS;
    this.dataTableEnterpriseValue.countServiceL3 = this.activityDetailObj.countServiceL3;

    if(this.dataTableEnterpriseValue.lastChkServiceEds != this.activityDetailObj.serviceLastCheck.lastChkServiceEds){
      this.dataTableEnterpriseValue.lastChkServiceEds = this.activityDetailObj.serviceLastCheck.lastChkServiceEds;
    }
    
  }

  callBackAction(data, actionCallBack) {
    //console.log('index : '+index);

    // data.index = index;
    let param = { data: data, actionCallBack: actionCallBack };
    this.onCallBackAction.emit(param);
  }

  onTblCallBackAction(data) {
    this.onCallBackAction.emit(data);
  }

  onClickNote() {
    let subConfirm = new SmartcontrolConfirmMessageModel();
    subConfirm.title = 'Service Enterprise Note';
    subConfirm.commentTitle = 'Note ';
    subConfirm.commentResult = this.activityDetailObj.serviceEnterpriseNote;
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
            this.activityDetailObj.serviceEnterpriseNote = result.commentResult;
            this.dataMaster.controlDetail.serviceEnterpriseNote = null;
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
}
