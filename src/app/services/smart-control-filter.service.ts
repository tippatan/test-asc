import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { SmartControlService } from './smart-control.service';

@Injectable({
  providedIn: 'root',
})
export class SmartControlFilterService {
  listSystemGroup = new BehaviorSubject<Array<any>[]>([]);
  listRegion = new BehaviorSubject<Array<any>[]>([]);
  listActivityType = new BehaviorSubject<Array<any>[]>([]);
  listAliasNode = new BehaviorSubject<Array<any>[]>([]);
  listStatus = new BehaviorSubject<Array<any>[]>([]);
  listImportance = new BehaviorSubject<Array<any>[]>([]);
  listGroup = new BehaviorSubject<Array<any>[]>([]);
  listImpact = new BehaviorSubject<Array<any>[]>([]);
  listImpactNRI = new BehaviorSubject<Array<any>[]>([]);
  listActivityError = new BehaviorSubject<Array<any>[]>([]);
  listCorpDocStatus = new BehaviorSubject<Array<any>[]>([]);
  listCorpProductImpact = new BehaviorSubject<Array<any>[]>([]);
  listRemarkGroup = new BehaviorSubject<Array<any>[]>([]);
  listWrAction = new BehaviorSubject<Array<any>[]>([]);

  constructor(private smartControlService: SmartControlService) {}

  setListDropdownSystemGroupByUser(listSystemGroup: Array<any>[]) {
    this.listSystemGroup.next(listSystemGroup);
  }

  // return listSystemGroup as an Observable
  getListDropdownSystemGroupByUser(): Observable<Array<any>[]> {
    // only if length of array is 0, load from server
    if (this.listSystemGroup.getValue().length === 0) {
      this.loadListDropdownSystemGroupByUser();
    }

    // return listSystemGroup for subscription even if the array is yet empty.
    // It‘ll get filled soon.
    return this.listSystemGroup.asObservable();
  }

  private loadListDropdownSystemGroupByUser(): void {
    this.smartControlService
      .listDropdownSystemGroupByUser()
      .takeWhile((alive) => true)
      .subscribe(async (data) => {
        //console.log('filter service loadListGroupByUser',data.resultData);

        this.listSystemGroup.next(data.resultData);
      });
  }

  setListRegion(listRegion: Array<any>[]) {
    this.listRegion.next(listRegion);
  }

  // return listRegion as an Observable
  getListRegion(): Observable<Array<any>[]> {
    // only if length of array is 0, load from server
    if (this.listRegion.getValue().length === 0) {
      this.loadListDropDownRegionEN();
    }

    // return listRegion for subscription even if the array is yet empty.
    // It‘ll get filled soon.
    return this.listRegion.asObservable();
  }

  private loadListDropDownRegionEN(): void {
    this.smartControlService
      .getDropDownRegionEN()
      .takeWhile((alive) => true)
      .subscribe(async (data) => {
        this.listRegion.next(data.resultData);
      });
  }

  setListActivityType(listActivityType: Array<any>[]) {
    this.listActivityType.next(listActivityType);
  }

  // return listActivityType as an Observable
  getListActivityType(): Observable<Array<any>[]> {
    // only if length of array is 0, load from server
    if (this.listActivityType.getValue().length === 0) {
      this.loadListActivityType();
    }

    // return listActivityType for subscription even if the array is yet empty.
    // It‘ll get filled soon.
    return this.listActivityType.asObservable();
  }

  private loadListActivityType(): void {
    this.smartControlService
      .getDropDownActivityType()
      .takeWhile((alive) => true)
      .subscribe(async (data) => {
        //console.log('filter service loadListActivityType',data.resultData);

        this.listActivityType.next(data.resultData);
      });
  }

  setListAliasNode(listAliasNode: Array<any>[]) {
    this.listAliasNode.next(listAliasNode);
  }

  // return listAliasNode as an Observable
  getListAliasNode(): Observable<Array<any>[]> {
    // only if length of array is 0, load from server
    if (this.listAliasNode.getValue().length === 0) {
      this.loadListAliasNode();
    }

    // return listAliasNode for subscription even if the array is yet empty.
    // It‘ll get filled soon.
    return this.listAliasNode.asObservable();
  }

  private loadListAliasNode(): void {
    this.smartControlService
      .getDropDownAliasNode()
      .takeWhile((alive) => true)
      .subscribe(async (data) => {
        //console.log('filter service loadListAliasNode',data.resultData);

        this.listAliasNode.next(data.resultData);
      });
  }

  setListStatus(listStatus: Array<any>[]) {
    this.listStatus.next(listStatus);
  }

  // return listStatus as an Observable
  getListStatus(): Observable<Array<any>[]> {
    // only if length of array is 0, load from server
    if (this.listStatus.getValue().length === 0) {
      this.loadListStatus();
    }

    // return listStatus for subscription even if the array is yet empty.
    // It‘ll get filled soon.
    return this.listStatus.asObservable();
  }

  private loadListStatus(): void {
    this.smartControlService
      .listStatusActIsShowActm()
      .takeWhile((alive) => true)
      .subscribe(async (data) => {
        //console.log('filter service loadListStatus',data.resultData);

        this.listStatus.next(data.resultData);
      });
  }

  setListImportance(listImportance: Array<any>[]) {
    this.listImportance.next(listImportance);
  }

  // return listStatus as an Observable
  getListImportance(): Observable<Array<any>[]> {
    // only if length of array is 0, load from server
    if (this.listImportance.getValue().length === 0) {
      this.loadListImportance();
    }

    // return listImportance for subscription even if the array is yet empty.
    // It‘ll get filled soon.
    return this.listImportance.asObservable();
  }

  private loadListImportance(): void {
    this.smartControlService
      .getDropDownImportance('ASC_PRIORITY_IMPORTANCE')
      .takeWhile((alive) => true)
      .subscribe(async (data) => {
        //console.log('filter service loadListStatus',data.resultData);

        this.listImportance.next(data.resultData);
      });
  }

  setListGroup(listGroup: Array<any>[]) {
    this.listGroup.next(listGroup);
  }

  // return listGroup as an Observable
  getListGroup(): Observable<Array<any>[]> {
    // only if length of array is 0, load from server
    if (this.listGroup.getValue().length === 0) {
      this.loadListGroup();
    }

    // return listGroup for subscription even if the array is yet empty.
    // It‘ll get filled soon.
    return this.listGroup.asObservable();
  }

  private loadListGroup(): void {
    this.smartControlService
      .getDropDownImportance('ASC_PRIORITY_GROUP')
      .takeWhile((alive) => true)
      .subscribe(async (data) => {
        //console.log('filter service loadListStatus',data.resultData);

        this.listGroup.next(data.resultData);
      });
  }

  setListImpact(listImpact: Array<any>[]) {
    this.listImpact.next(listImpact);
  }

  // return listImpact as an Observable
  getListImpact(): Observable<Array<any>[]> {
    // only if length of array is 0, load from server
    if (this.listImpact.getValue().length === 0) {
      this.loadListImpact();
    }

    // return listImpact for subscription even if the array is yet empty.
    // It‘ll get filled soon.
    return this.listImpact.asObservable();
  }

  private loadListImpact(): void {
    this.smartControlService
      .getDropDownImpactType()
      .takeWhile((alive) => true)
      .subscribe(async (data) => {
        //console.log('filter service loadListImpact',data.resultData);

        this.listImpact.next(data.resultData);
      });
  }

  setListImpactNRI(listImpactNRI: Array<any>[]) {
    this.listImpactNRI.next(listImpactNRI);
  }

  // return listImpactNRI as an Observable
  getListImpactNRI(): Observable<Array<any>[]> {
    // only if length of array is 0, load from server
    if (this.listImpactNRI.getValue().length === 0) {
      this.loadListImpactNRI();
    }

    // return listImpactNRI for subscription even if the array is yet empty.
    // It‘ll get filled soon.
    return this.listImpactNRI.asObservable();
  }

  private loadListImpactNRI(): void {
    this.smartControlService
      .getDropDownNRI()
      .takeWhile((alive) => true)
      .subscribe(async (data) => {
        //console.log('filter service loadListImpactNRI',data.resultData);

        this.listImpactNRI.next(data.resultData);
      });
  }

  setListActivityError(listActivityError: Array<any>[]) {
    this.listActivityError.next(listActivityError);
  }

  // return listActivityError as an Observable
  getListActivityError(): Observable<Array<any>[]> {
    // only if length of array is 0, load from server
    if (this.listActivityError.getValue().length === 0) {
      this.loadListActivityError();
    }

    // return listActivityError for subscription even if the array is yet empty.
    // It‘ll get filled soon.
    return this.listActivityError.asObservable();
  }

  private loadListActivityError(): void {
    this.smartControlService
      .getDropDownErrorLevel()
      .takeWhile((alive) => true)
      .subscribe(async (data) => {
        console.log('filter service loadListActivityError', data.resultData);

        this.listActivityError.next(data.resultData);
      });
  }

  setListCorpDocStatus(listCorpDocStatus: Array<any>[]) {
    this.listCorpDocStatus.next(listCorpDocStatus);
  }

  // return listCorpDocStatus as an Observable
  getListCorpDocStatus(): Observable<Array<any>[]> {
    // only if length of array is 0, load from server
    if (this.listCorpDocStatus.getValue().length === 0) {
      this.loadListCorpDocStatus();
    }

    // return listCorpDocStatus for subscription even if the array is yet empty.
    // It‘ll get filled soon.
    return this.listCorpDocStatus.asObservable();
  }

  private loadListCorpDocStatus(): void {
    this.smartControlService
      .getCorpDocStatus()
      .takeWhile((alive) => true)
      .subscribe(async (data) => {
        console.log('filter service loadListCorpDocStatus', data.resultData);

        this.listCorpDocStatus.next(data.resultData);
      });
  }

  setListCorpProductImpact(listCorpProductImpact: Array<any>[]) {
    this.listCorpProductImpact.next(listCorpProductImpact);
  }

  // return listCorpProductImpact as an Observable
  getListCorpProductImpact(): Observable<Array<any>[]> {
    // only if length of array is 0, load from server
    if (this.listCorpProductImpact.getValue().length === 0) {
      this.loadListCorpProductImpact();
    }

    // return listCorpProductImpact for subscription even if the array is yet empty.
    // It‘ll get filled soon.
    return this.listCorpProductImpact.asObservable();
  }

  private loadListCorpProductImpact(): void {
    this.smartControlService
      .getDropDownCorpProductImpact()
      .takeWhile((alive) => true)
      .subscribe(async (data) => {
        this.listCorpProductImpact.next(data.resultData);
      });
  }

  setListRemarkGroup(listRemarkGroup: Array<any>[]) {
    this.listRemarkGroup.next(listRemarkGroup);
  }

  // return listRemarkGroup as an Observable
  getListRemarkGroup(): Observable<Array<any>[]> {
    // only if length of array is 0, load from server
    if (this.listRemarkGroup.getValue().length === 0) {
      this.loadListRemarkGroup();
    }

    // return listRemarkGroup for subscription even if the array is yet empty.
    // It‘ll get filled soon.
    return this.listRemarkGroup.asObservable();
  }

  private loadListRemarkGroup(): void {
    this.smartControlService
      .getDropDownRemarkGroup()
      .takeWhile((alive) => true)
      .subscribe(async (data) => {
        this.listRemarkGroup.next(data.resultData);
      });
  }

  setListWrAction(listWrAction: Array<any>[]) {
    this.listWrAction.next(listWrAction);
  }

  // return listWrAction as an Observable
  getListWrAction(): Observable<Array<any>[]> {
    // only if length of array is 0, load from server
    if (this.listWrAction.getValue().length === 0) {
      this.loadListWrAction();
    }

    // return listWrAction for subscription even if the array is yet empty.
    // It‘ll get filled soon.
    return this.listWrAction.asObservable();
  }

  private loadListWrAction(): void {
    this.smartControlService
      .getDropDownWRAutoAction()
      .takeWhile((alive) => true)
      .subscribe(async (data) => {
        this.listWrAction.next(data.resultData);
      });
  }
}
