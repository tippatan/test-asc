import { Component, Inject, NgModule, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SmartControlService } from 'app/services/smart-control.service';
import { SmartcontrolUtilService } from 'app/services/smartcontrol-util.service';
import { ConfirmationService, MessageService } from 'primeng-lts/api';
import { timer, combineLatest } from 'rxjs';
import { environment } from './../../../../../environments/environment.prod';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SmartControlFilterService } from 'app/services/smart-control-filter.service';

@Component({
  selector: 'app-user-filter-dialog',
  templateUrl: './user-filter-dialog.component.html',
  styleUrls: [
    './user-filter-dialog.component.scss',
    './../../../../../assets/css/asc.css',
  ],
})
export class UserFilterDialogComponent implements OnInit {
  dialog: MatDialogRef<UserFilterDialogComponent>;

  listRegion: Array<any>;
  listActivityType: Array<any>;
  listSystemGroup: Array<any>;
  listAliasNode: Array<any>;
  listStatus: Array<any>;
  listImportance: Array<any>;
  listGroup: Array<any>;

  downtime_yes: boolean;
  downtime_no: boolean;
  scheduleConflict: boolean;
  fbbImpact: boolean;
  tbbImpact: boolean;
  ska: boolean;
  listImpact: Array<any>;
  listImpactNRI: Array<any>;
  listActivityError: Array<any>;
  listCorpDocStatus: Array<any>;
  listCorpProductImpact: Array<any>;
  listRemarkGroup: Array<any>;
  siteAccess: boolean;
  listWrAction: Array<any>;
  selectLimit = 20;
  selectedFilter: any = {};
  resultFilter: any = {};
  checked = false;
  indeterminate = false;

  dropdownSettings = {};
  systemGroupDDLSettings: {};
  statusDDLSettings: {};
  corpProductImpDDLSettings = {};
  importanceDDLSettings = {};
  groupDDLSettings = {};

  isDisabledConfirmBtn: boolean = true;

  loading: boolean = false;

  userProfile: any;

  constructor(
    private http: HttpClient,
    private dialogRef: MatDialogRef<UserFilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data,
    private smartControlService: SmartControlService,
    private smartcontrolUtil: SmartcontrolUtilService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private filterService: SmartControlFilterService
  ) {}

  async ngOnInit() {
    this.userProfile = JSON.parse(localStorage.profile);
    this.loading = true;
    if (this.data.filterData) {
      this.resultFilter = JSON.parse(JSON.stringify(this.data.filterData));
    }

    await this.initSelectedFilter();

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'value',
      textField: 'label',
      enableCheckAll: false,
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 3,
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };
    this.initialDdlData();

    combineLatest([
      this.filterService.getListDropdownSystemGroupByUser(),
      this.filterService.getListRegion(),
      this.filterService.getListActivityType(),
      this.filterService.getListAliasNode(),
      this.filterService.getListStatus(),
      this.filterService.getListImportance(),
      this.filterService.getListGroup(),
      this.filterService.getListImpact(),
      this.filterService.getListImpactNRI(),
      this.filterService.getListActivityError(),
      this.filterService.getListCorpDocStatus(),
      this.filterService.getListCorpProductImpact(),
      this.filterService.getListRemarkGroup(),
      this.filterService.getListWrAction(),
    ]).subscribe(
      ([
        listSystemGroup,
        listRegion,
        listActivityType,
        listAliasNode,
        listStatus,
        listImportance,
        listGroup,
        listImpact,
        listImpactNRI,
        listActivityError,
        listCorpDocStatus,
        listCorpProductImpact,
        listRemarkGroup,
        listWrAction,
      ]) => {
        this.listSystemGroup = listSystemGroup;
        this.listRegion = listRegion;
        this.listActivityType = listActivityType;
        this.listAliasNode = listAliasNode;
        this.listStatus = listStatus;
        this.listImportance = listImportance;
        this.listGroup = listGroup;
        this.listImpact = listImpact;
        this.listImpactNRI = listImpactNRI;
        this.listActivityError = listActivityError;
        this.listCorpDocStatus = listCorpDocStatus;
        this.listCorpProductImpact = listCorpProductImpact;
        this.listRemarkGroup = listRemarkGroup;
        this.listWrAction = listWrAction;

        this.initFilterValue();
        this.loading = false;
      }
    );
  }

  async initialDdlData() {
    await this.listDropdownSystemGroupByUser();
    await this.getDropDownCorpProductImpact();
    await this.getDropDownImportance();
    await this.getDropDownGroup();
    return true;
  }

  initFilterValue() {
    if (this.resultFilter) {
      if (this.resultFilter.systemGroup) {
        this.selectedFilter.systemGroup = [];
        let initSystemGroup = this.resultFilter.systemGroup.split(',');
        this.selectedFilter.systemGroup = this.listSystemGroup.filter((f) =>
          initSystemGroup.includes(f.value)
        );
      }
      if (this.resultFilter.region) {
        this.selectedFilter.region = [];
        this.selectedFilter.region = this.resultFilter.region.split(',');

        this.listRegion.forEach((element) => {
          if (this.selectedFilter.region.includes(element.value)) {
            element.checker = true;
          }
        });
      }
      if (this.resultFilter.activityType) {
        this.selectedFilter.activityType = [];
        this.selectedFilter.activityType =
          this.resultFilter.activityType.split(',');

        this.listActivityType.forEach((element) => {
          if (this.selectedFilter.activityType.includes(element.value)) {
            element.checker = true;
          }
        });
      }
      if (this.resultFilter.aliasNode) {
        this.selectedFilter.aliasNode = [];
        let initAliasNode = this.resultFilter.aliasNode.split(',');
        this.selectedFilter.aliasNode = this.listAliasNode.filter((f) =>
          initAliasNode.includes(f.value)
        );
      }
      if (this.resultFilter.status) {
        this.selectedFilter.status = [];
        let initStatus = this.resultFilter.status.split(',');
        this.selectedFilter.status = this.listStatus.filter((f) =>
          initStatus.includes(f.statusId)
        );
      }
      if (this.resultFilter.downtime) {
        this.selectedFilter.downtime = this.resultFilter.downtime.split(',');
        this.selectedFilter.downtime.forEach((element) => {
          if (element === 'YES') {
            this.downtime_yes = true;
          } else if (element === 'NO') {
            this.downtime_no = true;
          } else {
            this.downtime_yes = false;
            this.downtime_no = false;
          }
        });
      }
      if (
        this.resultFilter.scheduleConflict &&
        this.resultFilter.scheduleConflict === 'YES'
      ) {
        this.selectedFilter.scheduleConflict.push('YES');
        this.scheduleConflict = true;
      }
      if (
        this.resultFilter.fbbImpact &&
        this.resultFilter.fbbImpact === 'YES'
      ) {
        this.selectedFilter.fbbImpact.push('YES');
        this.fbbImpact = true;
      }
      if (
        this.resultFilter.tbbImpact &&
        this.resultFilter.tbbImpact === 'YES'
      ) {
        this.selectedFilter.tbbImpact.push('YES');
        this.tbbImpact = true;
      }
      if (this.resultFilter.ska && this.resultFilter.ska === 'YES') {
        this.selectedFilter.ska.push('YES');
        this.ska = true;
      }
      if (this.resultFilter.impactType) {
        this.selectedFilter.impactType = [];
        let initImpactType = this.resultFilter.impactType.split(',');
        this.selectedFilter.impactType = this.listImpact.filter((f) =>
          initImpactType.includes(f.value)
        );
      }
      if (this.resultFilter.impactNRI) {
        this.selectedFilter.impactNRI = [];
        let initImpactNRI = this.resultFilter.impactNRI.split(',');
        this.selectedFilter.impactNRI = this.listImpactNRI.filter((f) =>
          initImpactNRI.includes(f.value)
        );
      }
      if (this.resultFilter.activityError) {
        this.selectedFilter.activityError = [];
        let initActivityError = this.resultFilter.activityError.split(',');
        this.selectedFilter.activityError = this.listActivityError.filter((f) =>
          initActivityError.includes(f.value)
        );
      }
      if (this.resultFilter.corpDocStatus) {
        this.selectedFilter.corpDocStatus = [];
        let initCorpDocStatus = this.resultFilter.corpDocStatus.split(',');
        this.selectedFilter.corpDocStatus = this.listCorpDocStatus.filter((f) =>
          initCorpDocStatus.includes(f.value)
        );
      }
      if (this.resultFilter.corpProductImpact) {
        this.selectedFilter.corpProductImpact = [];
        let initCorpProductImpact =
          this.resultFilter.corpProductImpact.split(',');
        this.selectedFilter.corpProductImpact =
          this.listCorpProductImpact.filter((f) =>
            initCorpProductImpact.includes(f.productImpactId)
          );
      }
      if (this.resultFilter.remarkGroup) {
        this.selectedFilter.remarkGroup = [];
        let initRemarkGroup = this.resultFilter.remarkGroup.split(',');
        this.selectedFilter.remarkGroup = this.listRemarkGroup.filter((f) =>
          initRemarkGroup.includes(f.value)
        );
      }
      if (
        this.resultFilter.siteAccess &&
        this.resultFilter.siteAccess === 'YES'
      ) {
        this.selectedFilter.siteAccess.push('YES');
        this.siteAccess = true;
      }
      if (this.resultFilter.wrAction) {
        this.selectedFilter.wrAction = [];
        let initWrAction = this.resultFilter.wrAction.split(',');
        this.selectedFilter.wrAction = this.listWrAction.filter((f) =>
          initWrAction.includes(f.value)
        );
      }

      if (this.resultFilter.importance) {
        this.selectedFilter.importance = [];
        let initImportance = this.resultFilter.importance.split(',');
        this.selectedFilter.importance = this.listImportance.filter((f) =>
          initImportance.includes(f.valueListValue)
        );
      }

      if (this.resultFilter.group) {
        this.selectedFilter.group = [];
        let initGroup = this.resultFilter.group.split(',');
        this.selectedFilter.group = this.listGroup.filter((f) =>
          initGroup.includes(f.valueListValue)
        );
      }
    }
  }

  listDropdownSystemGroupByUser(): any {
    this.systemGroupDDLSettings = {
      singleSelection: false,
      idField: 'value',
      textField: 'label',
      enableCheckAll: false,
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 3,
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };
  }

  getDropDownCorpProductImpact(): any {
    this.corpProductImpDDLSettings = {
      singleSelection: false,
      idField: 'productImpactId',
      textField: 'productImpacDesc',
      enableCheckAll: false,
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 3,
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };
  }

  getDropDownImportance(): any {
    this.importanceDDLSettings = {
      singleSelection: false,
      idField: 'valueListValue',
      textField: 'valueListDisplay',
      enableCheckAll: false,
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 3,
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };
  }

  getDropDownGroup(): any {
    this.groupDDLSettings = {
      singleSelection: false,
      idField: 'valueListValue',
      textField: 'valueListDisplay',
      enableCheckAll: false,
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 3,
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };
  }

  public onDropDownChange(ddltype: any) {
    if (ddltype === 'systemGroup') {
      this.resultFilter.systemGroup = this.selectedFilter.systemGroup
        .map((ddl) => ddl.value)
        .join(',');
    } else if (ddltype === 'aliasNode') {
      this.resultFilter.aliasNode = this.selectedFilter.aliasNode
        .map((ddl) => ddl.value)
        .join(',');
    } else if (ddltype === 'status') {
      this.resultFilter.status = this.selectedFilter.status
        .map((ddl) => ddl.statusId)
        .join(',');
    } else if (ddltype === 'impactType') {
      this.resultFilter.impactType = this.selectedFilter.impactType
        .map((ddl) => ddl.value)
        .join(',');
    } else if (ddltype === 'impactNRI') {
      this.resultFilter.impactNRI = this.selectedFilter.impactNRI
        .map((ddl) => ddl.value)
        .join(',');
    } else if (ddltype === 'activityError') {
      this.resultFilter.activityError = this.selectedFilter.activityError
        .map((ddl) => ddl.value)
        .join(',');
    } else if (ddltype === 'corpDocStatus') {
      this.resultFilter.corpDocStatus = this.selectedFilter.corpDocStatus
        .map((ddl) => ddl.value)
        .join(',');
    } else if (ddltype === 'corpProductImpact') {
      this.resultFilter.corpProductImpact =
        this.selectedFilter.corpProductImpact
          .map((ddl) => ddl.productImpactId)
          .join(',');
    } else if (ddltype === 'remarkGroup') {
      this.resultFilter.remarkGroup = this.selectedFilter.remarkGroup
        .map((ddl) => ddl.value)
        .join(',');
    } else if (ddltype === 'wrAction') {
      this.resultFilter.wrAction = this.selectedFilter.wrAction
        .map((ddl) => ddl.value)
        .join(',');
    } else if (ddltype === 'importance') {
      this.resultFilter.importance = this.selectedFilter.importance
        .map((ddl) => ddl.valueListValue)
        .join(',');
    } else if (ddltype === 'group') {
      this.resultFilter.group = this.selectedFilter.group
        .map((ddl) => ddl.valueListValue)
        .join(',');
    }
  }

  onChecker(type: any, value: string, isChecked: boolean) {
    // Use appropriate model type instead of any
    if (type === 'region') {
      if (isChecked) {
        this.resultFilter.region = this.selectedFilter.region.join(',');
      } else {
        this.selectedFilter.region = this.selectedFilter.region.filter(
          (f) => f != value
        );
        this.resultFilter.region = this.selectedFilter.region.join(',');
      }
    } else if (type === 'activityType') {
      if (isChecked) {
        this.resultFilter.activityType =
          this.selectedFilter.activityType.join(',');
      } else {
        this.selectedFilter.activityType =
          this.selectedFilter.activityType.filter((f) => f != value);
        this.resultFilter.activityType =
          this.selectedFilter.activityType.join(',');
      }
    } else if (type === 'downtime') {
      if (isChecked) {
        this.selectedFilter.downtime.push(value);
        this.resultFilter.downtime = this.selectedFilter.downtime.join(',');
      } else {
        this.selectedFilter.downtime = this.selectedFilter.downtime.filter(
          (f) => f != value
        );
        this.resultFilter.downtime = this.selectedFilter.downtime.join(',');
      }
    } else if (type === 'scheduleConflict') {
      if (isChecked) {
        this.selectedFilter.scheduleConflict.push(value);
        this.resultFilter.scheduleConflict =
          this.selectedFilter.scheduleConflict.join(',');
      } else {
        this.selectedFilter.scheduleConflict =
          this.selectedFilter.scheduleConflict.filter((f) => f != value);
        this.resultFilter.scheduleConflict =
          this.selectedFilter.scheduleConflict.join(',');
      }
    } else if (type === 'fbbImpact') {
      if (isChecked) {
        this.selectedFilter.fbbImpact.push(value);
        this.resultFilter.fbbImpact = this.selectedFilter.fbbImpact.join(',');
      } else {
        this.selectedFilter.fbbImpact = this.selectedFilter.fbbImpact.filter(
          (f) => f != value
        );
        this.resultFilter.fbbImpact = this.selectedFilter.fbbImpact.join(',');
      }
    } else if (type === 'tbbImpact') {
      if (isChecked) {
        this.selectedFilter.tbbImpact.push(value);
        this.resultFilter.tbbImpact = this.selectedFilter.tbbImpact.join(',');
      } else {
        this.selectedFilter.tbbImpact = this.selectedFilter.tbbImpact.filter(
          (f) => f != value
        );
        this.resultFilter.tbbImpact = this.selectedFilter.tbbImpact.join(',');
      }
    } else if (type === 'ska') {
      if (isChecked) {
        this.selectedFilter.ska.push(value);
        this.resultFilter.ska = this.selectedFilter.ska.join(',');
      } else {
        this.selectedFilter.ska = this.selectedFilter.ska.filter(
          (f) => f != value
        );
        this.resultFilter.ska = this.selectedFilter.ska.join(',');
      }
    } else if (type === 'siteAccess') {
      if (isChecked) {
        this.selectedFilter.siteAccess.push(value);
        this.resultFilter.siteAccess = this.selectedFilter.siteAccess.join(',');
      } else {
        this.selectedFilter.siteAccess = this.selectedFilter.siteAccess.filter(
          (f) => f != value
        );
        this.resultFilter.siteAccess = this.selectedFilter.siteAccess.join(',');
      }
    }
  }

  onApplyFilter() {
    let result: any = {};
    result.isSaveDefault = false;
    result.filter = this.resultFilter;

    this.dialogRef.close(result);
    this.messageService.add({
      severity: 'success',
      summary: 'success',
      detail: '',
    });
  }

  onSaveFilter() {
    this.smartControlService
      .addDefaultFilter(
        this.selectedFilter,
        this.userProfile.id ? this.userProfile.id : this.userProfile.pid
      )
      .takeWhile((alive) => true)
      .subscribe(
        async (data) => {
          const result = data;
          if (result && result.resultCode === '0') {
            this.initSelectedFilter();
            this.resultFilter = result.resultData;
            this.messageService.add({
              severity: 'success',
              summary: 'success',
              detail: '',
            });
          } else {
            console.log(result.resultMessage);
          }
        },
        (error) => {
          this.confirmationService.confirm({
            message: error,
            header: 'Error',
            icon: 'pi pi-exclamation-triangle',
            rejectLabel: 'Close',
            rejectButtonStyleClass: 'p-button-warning',
            acceptVisible: false,
          });
          this.loading = false;
        }
      );
    //-----------------------------
    let result: any = {};
    result.isSaveDefault = false;
    result.filter = this.resultFilter;

    this.dialogRef.close(result);
  }

  onLoadFilter() {
    this.initSelectedFilter();
    this.smartControlService
      .getDefaultFilter(
        this.userProfile.name,
        this.userProfile.id ? this.userProfile.id : this.userProfile.pid
      )
      .takeWhile((alive) => true)
      .subscribe(
        async (data) => {
          const result = data;
          if (result && result.resultCode === '0') {
            this.resultFilter = result.resultData;
            this.initFilterValue();
          } else {
            //console.log(result.resultMessage);
          }
        },
        (error) => {
          this.confirmationService.confirm({
            message: error,
            header: 'Error',
            icon: 'pi pi-exclamation-triangle',
            rejectLabel: 'Close',
            rejectButtonStyleClass: 'p-button-warning',
            // key: 'warningDialog',
            acceptVisible: false,
          });
          this.loading = false;
        }
      );
  }

  onClearFilter() {
    this.clearFilter();
  }

  onClose() {
    this.dialogRef.close();
  }

  initSelectedFilter() {
    this.selectedFilter.systemGroup = []; //chk
    this.selectedFilter.region = []; //chk
    this.selectedFilter.activityType = [];
    this.selectedFilter.aliasNode = [];
    this.selectedFilter.status = [];
    this.selectedFilter.downtime = []; //chk
    this.selectedFilter.scheduleConflict = []; //chk
    this.selectedFilter.fbbImpact = []; //chk
    this.selectedFilter.tbbImpact = []; //chk
    this.selectedFilter.ska = []; //chk
    this.selectedFilter.impactType = [];
    this.selectedFilter.impactNRI = [];
    this.selectedFilter.activityError = [];
    this.selectedFilter.corpDocStatus = [];
    this.selectedFilter.corpProductImpact = [];
    this.selectedFilter.remarkGroup = [];
    this.selectedFilter.siteAccess = []; //chk
    this.selectedFilter.wrAction = [];
    this.selectedFilter.importance = [];
    this.selectedFilter.group = [];
  }

  clearFilter() {
    this.initSelectedFilter();
    this.resultFilter = {};
    this.downtime_yes = null;
    this.downtime_no = null;
    this.scheduleConflict = null;
    this.fbbImpact = null;
    this.tbbImpact = null;
    this.ska = null;
    this.siteAccess = null;
  }
}
