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
  selector: 'app-act-detail-worker-tbl',
  templateUrl: './act-detail-worker-tbl.component.html',
  styleUrls: [
    './act-detail-worker-tbl.component.css',
    '../../../data-table2/data-table2.component.css',
  ],
})
export class ActDetailWorkerTblComponent implements OnInit {
  constructor() {}

  @Input() rows: any;
  @Input() canSaveActivity: any;
  @Output() onTblCallBackAction = new EventEmitter();
  @Output() onCustomSorting = new EventEmitter();

  @Input() pagingControlId: string;
  @Input() selectedPageSize: number;
  @Input() currentPage: number;
  @Input() total: number;

  columnListWorker: Array<Columns> = [
    new Columns({ headerName: 'Job', propertyName: 'jbId' }),
    new Columns({
      headerName: 'Name - SurName',
      propertyName: 'displayNameSurName',
    }),
    new Columns({ headerName: 'Mobile', propertyName: 'mobileNo' }),
    new Columns({ headerName: 'Team', propertyName: 'dept' }),
    new Columns({ headerName: 'Remark', propertyName: 'remark' }),
  ];

  ngOnInit() {
    this.columnListWorker.forEach((element) => {
      element.isSortingAsc = null;
    });
  }

  callBackAction(data, actionCallBack) {
    let param = { data: data, actionCallBack: actionCallBack };
    this.onTblCallBackAction.emit(param);
  }

  onSorting(col: any, index: number) {
    this.columnListWorker.forEach((element) => {
      if (element.headerName != col.headerName) {
        element.isSortingAsc = null;
      }
    });
    let param = { col: col, index: index };
    this.onCustomSorting.emit(param);
  }
}
