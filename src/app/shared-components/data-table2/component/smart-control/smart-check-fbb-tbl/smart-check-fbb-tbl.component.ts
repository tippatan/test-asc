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
  selector: 'app-smart-check-fbb-tbl',
  templateUrl: './smart-check-fbb-tbl.component.html',
  styleUrls: [
    './smart-check-fbb-tbl.component.css',
    '../../../data-table2/data-table2.component.css',
    '../smart-control-table.css',
  ],
})
export class SmartCheckFbbTblComponent implements OnInit {
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

  columnListAlarm: Array<Columns> = [
    new Columns({ headerName: 'Online', propertyName: 'countOnline' }),
    new Columns({ headerName: 'All', propertyName: 'countAll' }),
    new Columns({ headerName: 'OLT/DSLAM', propertyName: 'accessNode' }),
    new Columns({ headerName: 'PON', propertyName: 'pon' }),
    new Columns({ headerName: 'Splitter', propertyName: 'splitterFullName' }),
  ];

  ngOnInit() {
    this.columnListAlarm.forEach((element) => {
      element.isSortingAsc = null;
    });
  }

  ngAfterViewInit() {
    if (this.rows && this.rows.length > 0) {
      this.col = this.rows[0].rolloutActivities;
    } else {
      this.col = null;
    }
  }

  callBackAction(data, actionCallBack, index) {
    data.index = index;
    let param = { data: data, actionCallBack: actionCallBack, index: index };
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
