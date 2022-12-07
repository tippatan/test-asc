import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { Columns } from '../../../models/columns';

@Component({
  selector: 'app-smart-check-enterprise-tbl',
  templateUrl: './smart-check-enterprise-tbl.component.html',
  styleUrls: [
    './smart-check-enterprise-tbl.component.css',
    '../../../data-table2/data-table2.component.css',
    '../smart-control-table.css',
  ],
})
export class SmartCheckEnterpriseTblComponent implements OnInit {
  constructor() {}

  @Input() rows: any;
  @Output() onCallBackAction = new EventEmitter();
  @Output() onCustomSorting = new EventEmitter();

  @Input() pagingControlId: string;
  @Input() selectedPageSize: number;
  @Input() currentPage: number;
  @Input() total: number;
  @Input() limitEDS: any;

  index: any;

  col: any;

  colorList = ['fontColor1', 'fontColor2'];
  headerList = ['headerColor1', 'headerColor2'];
  headerListLight = ['headerColor1-light', 'headerColor2-light'];
  tableStyleList = ['fiveActTbl', 'sixActTbl'];
  tableStyle: string;

  columnListAlarm: Array<Columns> = [
    new Columns({ headerName: 'Result', propertyName: 'result' }),
    new Columns({ headerName: 'Importance', propertyName: 'importance' }),
    new Columns({ headerName: 'SKA', propertyName: 'ska' }),
    new Columns({ headerName: 'Group', propertyName: 'group' }),
    new Columns({ headerName: 'ID', propertyName: 'customerId' }),
    new Columns({ headerName: 'Customer Name', propertyName: 'customerName' }),
    new Columns({ headerName: 'Node', propertyName: 'node' }),
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
