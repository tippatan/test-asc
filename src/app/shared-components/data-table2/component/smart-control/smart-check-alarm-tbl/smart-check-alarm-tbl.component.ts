import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { Columns } from 'app/shared-components/data-table2/models/columns';

@Component({
  selector: 'app-smart-check-alarm-tbl',
  templateUrl: './smart-check-alarm-tbl.component.html',
  styleUrls: [
    './smart-check-alarm-tbl.component.css',
    '../../../data-table2/data-table2.component.css',
    '../smart-control-table.css',
  ],
})
export class SmartCheckAlarmTblComponent implements OnInit {
  constructor() {}

  @Input() rows: any;
  @Output() onCallBackAction = new EventEmitter();
  @Output() onCustomSorting = new EventEmitter();

  @Input() pagingControlId: string;
  @Input() selectedPageSize: number;
  @Input() currentPage: number;
  @Input() total: number;

  index: any;

  col: any;

  colorList = ['fontColor1', 'fontColor2'];
  headerList = ['headerColor1', 'headerColor2'];
  headerListLight = ['headerColor1-light', 'headerColor2-light'];
  tableStyleList = ['fiveActTbl', 'sixActTbl'];
  tableStyle: string;

  rolloutActStatus = {
    PENDING: 'PENDING',
    DELAY: 'DELAY',
    DELAY_W_WR: 'DELAY_W_WR',
    APPROVED_W_DATE: 'APPROVED_W_DATE',
    APPROVED_W_WR: 'APPROVED_W_WR',
    SUSPEND_ASSET: 'SUSPEND_ASSET',
    SUSPEND_RUNTIME: 'SUSPEND_RUNTIME',
    PENDING_W_WR: 'PENDING_W_WR',
  };

  statusMode = {
    EDIT: 'E',
    WARNING: 'W',
    NORMAL: 'N',
  };

  waitConfirmDate = 'Wait Confirm Date';

  columnListAlarm: Array<Columns> = [
    new Columns({ headerName: 'Severity', propertyName: 'severity' }),
    new Columns({ headerName: 'Date Time', propertyName: 'firstInsertTime' }),
    new Columns({ headerName: 'Server Serial', propertyName: 'serverSerial' }),
    new Columns({
      headerName: 'Alarm Description',
      propertyName: 'description',
    }),
  ];

  ngOnInit() {}

  ngAfterViewInit() {
    if (this.rows && this.rows.length > 0) {
      this.col = this.rows[0].rolloutActivities;
    } else {
      this.col = null;
    }
  }

  callBackAction(data, actionCallBack) {
    let param = { data: data, actionCallBack: actionCallBack };
    this.onCallBackAction.emit(param);
  }

  getPending(status, teamLead, remark) {
    if (
      this.rolloutActStatus.PENDING === status ||
      this.rolloutActStatus.PENDING_W_WR === status
    ) {
      return remark;
    }
    return teamLead;
  }

  onCheckMode(status) {
    let mode = '';

    if (
      this.rolloutActStatus.PENDING === status ||
      this.rolloutActStatus.DELAY === status ||
      this.rolloutActStatus.PENDING_W_WR === status ||
      this.rolloutActStatus.DELAY_W_WR === status
    ) {
      mode = this.statusMode.EDIT;
    } else if (
      this.rolloutActStatus.APPROVED_W_DATE === status ||
      this.rolloutActStatus.APPROVED_W_WR === status ||
      this.rolloutActStatus.SUSPEND_ASSET === status ||
      this.rolloutActStatus.SUSPEND_RUNTIME === status
    ) {
      mode = this.statusMode.WARNING;
    } else {
      mode = this.statusMode.NORMAL;
    }
    return mode;
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
