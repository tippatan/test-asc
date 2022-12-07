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
  selector: 'app-act-detail-alarm-tbl',
  templateUrl: './act-detail-alarm-tbl.component.html',
  styleUrls: [
    './act-detail-alarm-tbl.component.css',
    '../../../data-table2/data-table2.component.css',
    '../smart-control-table.css',
  ],
})
export class ActDetailAlarmTblComponent implements OnInit {
  constructor() {}

  @Input() rows: any;
  @Input() dataRowsCustom: any;
  @Input() canSaveActivity: any;
  @Output() onTblCallBackAction = new EventEmitter();
  @Output() onCustomSorting = new EventEmitter();

  @Input() pagingControlId: string;
  @Input() selectedPageSize: number;
  @Input() currentPage: number;
  @Input() total: number;

  index: any;

  col: any;

  columnListAlarm: Array<Columns> = [
    new Columns({ headerName: 'BF', propertyName: 'chkBfFlag' }),
    new Columns({ headerName: 'AT', propertyName: 'chkAtFlag' }),
    new Columns({
      headerName: 'Date Time',
      propertyName: 'alarmDate',
      propertySort: 'alarmDate',
    }),
    new Columns({ headerName: 'Site Code', propertyName: 'siteCode' }),
    new Columns({ headerName: 'Non ID', propertyName: 'nonMobile' }),
    new Columns({ headerName: 'AMO Name', propertyName: 'amoName' }),
    new Columns({ headerName: 'Alarm Description', propertyName: 'alarmDesc' }),
    new Columns({ headerName: 'Server Serial', propertyName: 'serverSerial' }),
  ];

  ngOnInit() {
    this.columnListAlarm.forEach((element) => {
      element.isSortingAsc = null;
    });
  }

  callBackAction(data, index, actionCallBack) {
    let param = { data: data, actionCallBack: actionCallBack, index: index };
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
}
