import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Columns } from '../../../models/columns';

@Component({
  selector: 'app-act-detail-enterprise-tbl',
  templateUrl: './act-detail-enterprise-tbl.component.html',
  styleUrls: [
    './act-detail-enterprise-tbl.component.css',
    '../../../data-table2/data-table2.component.css',
    '../smart-control-table.css',
  ],
})
export class ActDetailEnterpriseTblComponent implements OnInit {
  constructor() {}

  @Input() rows: any;
  @Input() canSaveActivity: any;
  @Input() limitEDS: any;
  @Input() countServiceL3: any;
  @Output() onTblCallBackAction = new EventEmitter();
  @Output() onCustomSorting = new EventEmitter();

  @Input() pagingControlId: string;
  @Input() selectedPageSize: number;
  @Input() currentPage: number;
  @Input() total: number;
  @Input() lastChkServiceEds: any;

  columnListAlarm: Array<Columns> = [
    new Columns({ headerName: 'Before', propertyName: 'chkBfFlag' }),
    new Columns({ headerName: 'After', propertyName: 'chkAtFlag' }),
    new Columns({ headerName: 'CP ID', propertyName: 'cpId' }),
    new Columns({ headerName: 'Service Type', propertyName: 'serviceType' }),
    new Columns({ headerName: 'Importance', propertyName: 'importanceLevel' }),
    new Columns({ headerName: 'SKA', propertyName: 'ska' }),
    new Columns({ headerName: 'Group', propertyName: 'priorityGroup' }),
    new Columns({ headerName: 'ID', propertyName: 'nonMobile' }),
    new Columns({ headerName: 'Customer Name', propertyName: 'customerName' }),
    new Columns({ headerName: 'Node', propertyName: 'node' }),
    new Columns({ headerName: 'Start Time', propertyName: 'startDateTime' }),
    new Columns({ headerName: 'End Time', propertyName: 'finishDateTime' }),
    new Columns({ headerName: 'Down Time', propertyName: 'downTime' }),
  ];

  ngOnInit() {
    this.columnListAlarm.forEach((element) => {
      element.isSortingAsc = null;
    });
  }

  callBackAction(data, actionCallBack) {
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

  isStartWithL3(data: any){
    let result = false;
    if(data){
      data = data.toUpperCase();
      if(data.startsWith('L3')){
        result = true;
      }
    }
    return result;
  }
}
