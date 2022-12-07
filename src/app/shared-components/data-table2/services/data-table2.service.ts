import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
export class DataTable2Service {
  private pageSizeListSubject = new ReplaySubject<Array<number>>(1);
  private tableDataSubject = new ReplaySubject(1);
  private pageChangeSubject = new ReplaySubject(1);
  private pageSizeChangeSubject = new ReplaySubject(1);
  private sortingSubject = new ReplaySubject(1);
  private updateDataSubject = new ReplaySubject<any>(1);
  private updateMultipleDataSubject = new ReplaySubject(1);
  private selectedRowSubject = new ReplaySubject<any>(1);
  private _paginationOnServerEnable: boolean;
  private _sortingOnServerEnable: boolean;
  private _currentPage;
  private _pageSize;
  private _sortingBy;
  private _sortingOrder;
  private _data;
  private _dataStatus;

  constructor() {}

  getPageSizeList(): Observable<Array<number>> {
    return this.pageSizeListSubject.asObservable();
  }

  setPageSizeList(pageSizeList: Array<number>) {
    this.pageSizeListSubject.next(pageSizeList);
  }

  getTableData(): Observable<any> {
    return this.tableDataSubject.asObservable();
  }

  setTableData(data) {
    this.dataTable = data;
    this.tableDataSubject.next(data);
  }

  onPageChange() {
    this.pageChangeSubject.next(true);
  }

  subscribePageChange() {
    return this.pageChangeSubject.asObservable();
  }

  onPageSizeChange() {
    this.pageSizeChangeSubject.next(true);
  }

  subscribePageSizeChange() {
    return this.pageSizeChangeSubject.asObservable();
  }

  onSorting() {
    this.sortingSubject.next(true);
  }

  subscribeSorting() {
    return this.sortingSubject.asObservable();
  }

  onUpdateData(data: any) {
    this.updateDataSubject.next(data);
  }

  subscribeUpdataData() {
    return this.updateDataSubject.asObservable();
  }

  onUpdataMultipleData(data: any) {
    this.updateMultipleDataSubject.next(data);
  }

  subscribeUpdataMultipleData() {
    return this.updateMultipleDataSubject.asObservable();
  }

  get paginationOnServerEnable(): boolean {
    return this._paginationOnServerEnable;
  }

  set paginationOnServerEnable(paginationOnServerEnable: boolean) {
    this._paginationOnServerEnable = paginationOnServerEnable;
  }

  get sortingOnServerEnable(): boolean {
    return this._sortingOnServerEnable;
  }

  set sortingOnServerEnable(sortingOnServerEnable: boolean) {
    this._sortingOnServerEnable = sortingOnServerEnable;
  }

  get currentPage() {
    return this._currentPage;
  }

  set currentPage(currentPage) {
    this._currentPage = currentPage;
  }

  get pageSize() {
    return this._pageSize;
  }

  set pageSize(pageSize) {
    this._pageSize = pageSize;
  }

  get sortingBy() {
    return this._sortingBy;
  }

  set sortingBy(sortingBy: string) {
    this._sortingBy = sortingBy;
  }

  get sortingOrder() {
    return this._sortingOrder;
  }

  set sortingOrder(sortingOrder: string) {
    this._sortingOrder = sortingOrder;
  }

  get dataTable() {
    return this._data;
  }

  set dataTable(data: any) {
    this._data = data;
  }

  get dataStatus() {
    return this._dataStatus;
  }

  set selectedRow(row) {
    this.selectedRowSubject.next(row);
  }

  get selectedRow() {
    return this.selectedRowSubject.asObservable();
  }
}
