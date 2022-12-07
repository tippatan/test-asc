import { SelectionModel } from '@angular/cdk/collections';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Columns } from '../../../models/columns';
import { DialogModule } from 'primeng-lts/dialog';
import { TtsServiceService } from 'app/services/tts-service.service';

@Component({
  selector: 'app-act-detail-fbb-tbl',
  templateUrl: './act-detail-fbb-tbl.component.html',
  styleUrls: [
    './act-detail-fbb-tbl.component.scss',
    '../../../data-table2/data-table2.component.css',
    '../smart-control-table.css',
  ],
})
export class ActDetailFbbTblComponent implements OnInit {
  constructor(
    private DialogModule: DialogModule,
    private ttsService: TtsServiceService,
  ) {}

  @Input() rows: any;
  @Input() canSaveActivity: any;
  @Input() smsType: string;
  @Output() onTblCallBackAction = new EventEmitter();
  @Output() onCustomSorting = new EventEmitter();

  @Input() pagingControlId: string;
  @Input() selectedPageSize: number;
  @Input() currentPage: number;
  @Input() total: number;
  @Input() reload: any;
  @Input() lastChkServiceFbb: any;

  loading: boolean = false;

  columnListAlarm: Array<Columns> = [
    new Columns({ headerName: 'Impact', propertyName: 'impactFlag' }),
    new Columns({ headerName: 'Before', propertyName: 'chkBfCount' }),
    new Columns({ headerName: 'After', propertyName: 'chkAtCount' }),
    new Columns({ headerName: 'OLT/DSLAM', propertyName: 'accessNode' }),
    new Columns({ headerName: 'PON', propertyName: 'ponNo' }),
    new Columns({ headerName: 'Splitter', propertyName: 'splitter' }),
    new Columns({ headerName: 'FBB No.', propertyName: 'totalCount' }),
    new Columns({ headerName: 'Plan Down', propertyName: 'planDown' }),
    new Columns({ headerName: '3BB No.', propertyName: 'count3bb' })
  ];

  rowSelected : any
  selection = new SelectionModel<any>(true, []);
  isAllSelection : boolean = false;

  rowCanSendSms : any;
  countFBB: number = 0;
  count3BB: number = 0;
  customerDetailDialogHeader: string = '';
  showCustomerDetailDialog: boolean;
  customerDetailList: Array<any> = [];

  ngOnInit() {
    // console.log('..........fbb tbl ngOnInit : ');
    
    this.columnListAlarm.forEach((element) => {
      element.isSortingAsc = null;
    });
   
    
  }

  ngOnChanges(changes: SimpleChanges): void {
   
    // console.log('fbb tbl ngOnChanges changes.rows  ======>',changes.rows );
      // if(changes.reload){
      //   this.rows = changes.reload.currentValue;
      // }
    if (changes.rows || changes.canSaveActivity || changes.smsType) {
      
      if(this.rows){
        this.selection.clear();
        this.isAllSelection = false;
        this.rowCanSendSms = this.rows.filter(row => !row.sendSmsDate && (this.smsType === 'CANCEL' ||  row.chkAtDate));
        this.countFBB = 0;
        this.count3BB = 0;
        this.rows.forEach(row => {
          if( !row.sendSmsDate && row.selected && (this.smsType === 'CANCEL' ||  row.chkAtDate))this.selection.select(row);
          this.countFBB += parseInt(row.totalCount ? row.totalCount : 0);
          this.count3BB += parseInt(row.count3bb ? row.count3bb : 0);
        });

        if(this.rowCanSendSms.length > 0)
          this.isAllSelection = this.isAllSelected();
        // console.log('..........fbb tbl ngOnInit data : ',this.rows,this.rowCanSendSms ,this.isAllSelection, this.selection.selected);
      }
    }
  }

  callBackAction(data, actionCallBack) {
    // console.log('..........fbb tbl callBackAction : ',data,actionCallBack);
    
    let param = { data: data, actionCallBack: actionCallBack };
    this.onTblCallBackAction.emit(param);
  }

  onSorting(col: any, index: number) {
    this.columnListAlarm.forEach((element) => {
      if (element.headerName != col.headerName) {
        element.isSortingAsc = null;
      }
    });
    let param = { col: col, index: index };
    this.onCustomSorting.emit(param);
  }

  onChecker(row: any){
   
    this.selection.toggle(row);
    this.isAllSelection = this.isAllSelected();
    // console.log('onChecker this.selection : ',this.selection,this.isAllSelection,this.isAllSelected());
    this.callBackAction(row, 'onCheckSendSmsFBB');
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    // const numRows = this.rows.length;
    const numRows = this.rowCanSendSms.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.rows.forEach(row => {
          if( !row.sendSmsDate && (this.smsType === 'CANCEL' ||  row.chkAtDate))this.selection.select(row);
        });

        this.rows.forEach(row => {
          row.selected = (this.isAllSelected() && !row.sendSmsDate && (this.smsType === 'CANCEL' ||  row.chkAtDate));
        });

        this.callBackAction(this.rows, 'onCheckAllSendSmsFBB');
  }

  openCustomerDetail(item: any ,customerType: string, customerNo: number){
    this.loading = true;
    this.customerDetailList = [];
    let customerNoSelected = customerNo ? customerNo : 0;

    this.customerDetailDialogHeader = `No. of 3BB is ${customerNoSelected}`;
    
    let ponNo = '';
    if(item.ponNo && item.splitter){
      ponNo = item.ponNo+'_'+item.splitter;
    }else if(item.ponNo){
      ponNo = item.ponNo;
    }else if(item.splitter){
      ponNo = item.splitter;
    }
    
    let reqBody: any  = {
      userId: 'U03696',
      customerType: customerType,
      accessNode: item.accessNode ? item.accessNode : '',
      ponNo: ponNo
    };
    
    this.ttsService
      .getCustomerDetail(reqBody)
      .takeWhile((alive) => true)
      .subscribe(
        async (data) => {
          const result = data;
          console.log(result);
          if (result && result.resultCode == '0') {
            let resultData = result.resultData;
            this.customerDetailList = resultData;
            this.loading = false;
            this.showCustomerDetailDialog = true;
          }
        },
        (error) => {
          this.loading = false;
          this.showCustomerDetailDialog = true;
        }
      );
  }

  closeCustomerDetailDialog(){
    this.showCustomerDetailDialog = false;
  }


}
