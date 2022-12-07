import { DataTable2Service } from './../services/data-table2.service';
import { Columns } from './../models/columns';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  SimpleChange,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

import { PaginatorService } from './../services/paginator.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-data-table2',
  templateUrl: './data-table2.component.html',
  styleUrls: ['./data-table2.component.css'],
  providers: [PaginatorService, DataTable2Service],
})
export class DataTable2Component implements OnChanges, OnInit {
  @Input() iconActionAble: boolean = false;
  @Input() rowClickAble: boolean = false;
  @Input() tblStyle: string;
  @Input() username: string;
  @Input() dataValue: any;
  @Input() pagingControlId: string;
  @Input() pagingControlShow: boolean = true;
  @Input() mode: string;
  @Input() inputType: string;
  @Output() onCallBackAction = new EventEmitter();
  @Input() customTable: string;
  @Input() selectedAll = false;
  @Input() dataRefresh: any;
  @Input() headerStyle: string;

  colorList = ['color1', 'color2'];

  // pagingControlId = 'datatable';
  pageSizeList: Array<number>;
  selectedPageSize: number;
  currentPage = 1;
  columns: Array<any>;
  iconAction: Array<any>;
  rows: Array<any>;
  rowsLeft: Array<any>;
  rowsRight: Array<any>;
  total: number = 0;
  editData: any;
  _exportCriteria;

  private destroy$ = new Subject<void>();
  private alive = true;
  private columnEdit;
  constructor(
    formBuilder: FormBuilder,
    private dataTableService: DataTable2Service,
    private paginatorService: PaginatorService,
    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    console.log('data-table.component ngOnChanges changes ======>',changes);
    if(changes.dataValue){
      this.dataTableService.setTableData(changes.dataValue.currentValue);
    }
    
    if(changes.currentValue){
      this.dataTableService.setTableData(changes.currentValue);
    }
    this.getTableData();
  }

  ngDoCheck(): void {
    this.dataTableService.setTableData(this.dataValue);
  }

  ngOnInit() {
    console.log('ngOnInit getTableData');
    this.dataTableService.currentPage = 1;
    if (this.dataValue.pageSizeList) {
      this.dataTableService.setPageSizeList(this.dataValue.pageSizeList);
    } else {
      this.dataTableService.setPageSizeList([10, 20, 30, 50, 100]);
    }
    if (!this.pagingControlId) {
      this.pagingControlId = 'datatable';
    }

    if (!this.tblStyle) {
      this.tblStyle = 'defaultTbl';
    }

    if(!this.headerStyle){
      this.headerStyle = '';
    }
    this.dataTableService.setTableData(this.dataValue);
    this.getPageSizeList();
    this.getTableData();
  }

  onSelectedPageSize(data) {
    this.selectedPageSize = data;
    this.fireEventOnPageSizeChangeIfOnServer();
  }

  onPageChangeEvent(data) {
    this.currentPage = data;
    this.fireEventOnPageChangeIfOnServer();
  }

  onSorting(col: any, index: number) {
    console.log( '>--------------onSorting ',col, index);
    this.columns.forEach((column) => {
      if (col.headerName != column.headerName) {
        column.isSortingAsc = null;
      }
    });

    if (col.isSortingAsc == null || col.isSortingAsc === false) {
      col.isSortingAsc = true;
      if (this.dataTableService.sortingOnServerEnable) {
        this.dataTableService.sortingBy = col.value;
        this.dataTableService.sortingOrder = 'asc';
        this.currentPage = 1;
        this.dataTableService.currentPage = 1;
        console.log( '>--------------onSorting 1');
        this.dataTableService.onSorting();
      } else {
        console.log( '>--------------onSorting 2');
        this.rows.slice(0);
        this.rows.sort((a, b) => {
          if (col.propertySort) {
            if (a[col.propertySort] < b[col.propertySort]) return -1;
            else if (a[col.propertySort] > b[col.propertySort])
              return 1;
            return 0;
          } else if (a[col.propertyName]) {
            return String(a[col.propertyName]).localeCompare(
              String(b[col.propertyName])
            );
          } else {
            return 1;
          }
        });
      }
    } else {
      console.log( '>--------------onSorting 6');
      col.isSortingAsc = false;
      if (this.dataTableService.sortingOnServerEnable) {
        console.log( '>--------------onSorting 7');
        this.dataTableService.sortingBy = col.value;
        this.dataTableService.sortingOrder = 'desc';
        this.currentPage = 1;
        this.dataTableService.currentPage = 1;
        this.dataTableService.onSorting();
      } else {
        console.log( '>--------------onSorting 8');
        this.rows.slice(0);
        this.rows.sort((a, b) => {
          if (col.propertySort) {
            if (b[col.propertySort] < a[col.propertySort]) return -1;
            else if (b[col.propertySort] > a[col.propertySort])
              return 1;
            return 0;
          } else if (a[col.propertyName]) {
            return String(b[col.propertyName]).localeCompare(
              String(a[col.propertyName])
            );
          } else {
            return 1;
          }
        });
      }
    }
    // this.rows.reverse();
  }

  onCustomSorting(data) {
    if (data.col.isSortingAsc == null || data.col.isSortingAsc === false) {
      data.col.isSortingAsc = true;

      this.rows.slice(0);

      this.rows.sort((a, b) => {
        if (data.col.propertySort) {
          if (a[data.col.propertySort] < b[data.col.propertySort]) return -1;
          else if (a[data.col.propertySort] > b[data.col.propertySort])
            return 1;
          return 0;
        } else if (a[data.col.propertyName]) {
          return String(a[data.col.propertyName]).localeCompare(
            String(b[data.col.propertyName])
          );
        } else {
          return 1;
        }
      });
    } else {
      data.col.isSortingAsc = false;

      this.rows.slice(0);
      this.rows.sort((a, b) => {
        if (data.col.propertySort) {
          if (b[data.col.propertySort] < a[data.col.propertySort]) return -1;
          else if (b[data.col.propertySort] > a[data.col.propertySort])
            return 1;
          return 0;
        } else if (a[data.col.propertyName]) {
          return String(b[data.col.propertyName]).localeCompare(
            String(a[data.col.propertyName])
          );
        } else {
          return 1;
        }
      });
    }
  }

  callBackAction(event) {
    this.onCallBackAction.emit(event);
  }

  callBackActionBtn(data, actionCallBack) {
    let param = { data: data, actionCallBack: actionCallBack };
    this.onCallBackAction.emit(param);
  }

  onRowClick(data, actionCallBack) {
    let param = { data: data, actionCallBack: actionCallBack };
    this.onCallBackAction.emit(param);
  }

  onLinkClick(data, actionCallBack) {
    let param = { data: data, actionCallBack: actionCallBack };
    this.onCallBackAction.emit(param);
  }

  private fireEventOnPageSizeChangeIfOnServer() {
    this.dataTableService.pageSize = this.selectedPageSize;
    this.currentPage = 1;
    this.dataTableService.currentPage = 1;
    this.dataTableService.onPageSizeChange();
  }

  private fireEventOnPageChangeIfOnServer() {
    this.dataTableService.currentPage = this.currentPage;
    this.dataTableService.onPageChange();
  }

  private getPageSizeList() {
    this.dataTableService
      .getPageSizeList()
      .takeWhile((alive) => this.alive)
      .subscribe((data) => {
        if (data.length > 0) {
          this.pageSizeList = data;
          this.selectedPageSize = data[0];
        }
      });
  }

  private getTableData() {
    this.dataTableService
      .getTableData()
      .takeWhile((alive) => this.alive)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data) {
          try {
            this.columns = data.columnList;
            this.iconAction = data.iconActionList;
            this.rows = data.rowList;
            this.columnEdit = data.columnEditList;
            this.total = data.length;
          } catch (exception) {
            console.log(exception);
          }
        } else {
          this.columns = null;
          this.total = 0;
        }
      });
  }

  ngOnDestroy() {
    this.alive = false;
    this.destroy$.next();
    this.destroy$.complete();
  }

  callBackActionSelect(event) {
    this.onCallBackAction.emit(event);
    if (this.dataValue.isSelectAll != null) {
      this.selectedAll = this.dataValue.isSelectAll;
    }
  }
}
