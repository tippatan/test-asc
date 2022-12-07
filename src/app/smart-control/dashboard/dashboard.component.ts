import { formatDate } from '@angular/common';
import { Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SmartControlDataService } from 'app/services/smart-control-data.service';
import { SmartControlService } from 'app/services/smart-control.service';
import { TtsServiceService } from 'app/services/tts-service.service';
import {
  ConfirmationService,
  MenuItem,
  MessageService,
  PrimeNGConfig,
  SelectItem,
} from 'primeng-lts/api';
import { UserFilterDialogComponent } from '../shares/component/user-filter-dialog/user-filter-dialog.component';

import * as $ from 'jquery';
import { WebsocketService } from 'app/web-socket.service';
import { Chart } from 'chart.js';
import * as moment from 'moment';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [
    './dashboard.component.scss',
    './../smart-control.component.scss',
  ],
})
export class DashboardComponent implements OnInit {
  @ViewChild('barChart') barChart: any;
  loading: boolean = false;
  items: MenuItem[] = [];
  home: MenuItem;
  basicData: any;
  basicOptions: any;
  sortOptions: SelectItem[];
  sortOrder: number;
  sortField: string;
  sortKey: string;
  showNoti: boolean = false;
  showUserprofile: boolean = false;
  listWRStatusCanSendSMSCompleteFlow: any = [
    'FALLBACK',
    'FALLBACK_WITH_ERROR',
    'COMPLETE',
    'COMPLETE_WITH_ERROR',
    'COMPLETE_CONDITION',
  ];

  listWRStatusCanSendSMSCancelFlow: any = [
    'CANCEL',
    'CANCEL_WITH_UNEXPECTED'
  ];

  //chart
  data: any;

  public barChartOptions: any = {
    legend: {
      display: false,
    },
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            userCallback: function (label, index, labels) {
              // when the floored value is the same as the value we have a whole number
              if (Math.floor(label) === label) {
                return label;
              }
            },
          },
        },
      ],
    },
    onClick: (event, activeEls) => {
      const abbreviation_status: any = [
        'Test & Mon.',
        'CMP with Err.',
        'CMP with Con.',
        'FB with Err.',
        'CC with Un Ex.',
      ];
      const fullname_status: any = [
        'Test & Monitoring',
        'Complete with Error',
        'Complete with Condition',
        'Fallback with Error',
        'Cancel with Unexpected',
      ];
      let point = Chart.helpers.getRelativePosition(event, this.barChart.chart);
      let xIndex = this.barChart.chart.scales['x-axis-0'].getValueForPixel(
        point.x
      );
      let label = this.barChart.chart.data.labels[xIndex];

      let isAbbr: boolean = false;

      abbreviation_status.forEach((val, idex) => {
        if (label == val) {
          this.barChartStatus = fullname_status[idex];
          isAbbr = true;
          return isAbbr;
        }
      });

      if (!isAbbr) {
        this.barChartStatus = label;
      }

      if (this.barChartStatus == 'All') {
        this.listWrActivity = this.listWrActivityAll;
        this.graphStatus = this.barChartStatus;
      } else {
        this.listWrActivity = this.listWrActivityFilter.filter(
          (t) => t.statusActivityDesc === this.barChartStatus
        );
        this.graphStatus = this.barChartStatus;
      }
    },
    animation: {
      duration: 0,
      onComplete: function () {
        let chartInstance = this.chart,
          ctx = chartInstance.ctx;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        this.data.datasets.forEach(function (dataset) {
          for (var i = 0; i < dataset.data.length; i++) {
            var model =
                dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
              scale_max =
                dataset._meta[Object.keys(dataset._meta)[0]].data[i]._yScale
                  .maxHeight;
            ctx.fillStyle = '#444';
            var y_pos = model.y;
            // Make sure data value does not get overflown and hidden
            // when the bar's value is too close to max value of scale
            // Note: The y value is reverse, it counts from top down
            if ((scale_max - model.y) / scale_max >= 0.93) y_pos = model.y + 20;
            ctx.fillText(dataset.data[i], model.x, y_pos);
          }
        });
      },
    },
  };
  public barChartLabels: any = [
    'All',
    'Confirm',
    '30 Min',
    'In Progress',
    'Test & Mon.',
    'Delay',
    'Overtime',
    'Complete',
    'CMP with Err.',
    'CMP with Con.',
    'Fallback',
    'FB with Err.',
    'Cancel',
    'CC with Un Ex.',
  ];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = false;
  public barChartData: any = [{ data: [] }];
  barChartStatus: string = '';
  graphStatus: string = '';

  //data search criteria
  panelOpenState = true;
  listSystem: Array<any>;
  searchCriteria: any = {
    system: null,
    region: null,
    project: null,
    subProject: null,
    subContractor: null,
  };

  userProfile: any;
  dataNoti: any;
  powerFilter: string = '';
  searchUsername: string = '';
  startDate: Date = new Date();
  finishDate: Date = new Date();
  editCriteria: any = {
    startDate: '',
    finishDate: '',
    teamlead: null,
    reason: null,
  };
  defaultStartTime: Date = new Date();
  defaultEndTime: Date = new Date();

  datePickerType: string = 'DATE_TIME';
  datePickerMode: string = 'EDIT';

  current = new Date();
  //filter
  filter: any = {};

  //data dashboard
  listWrActivity: any;
  listWrActivityAll: any;
  listWrActivityFilter: any;
  listWrOnProcess= new Array<any>();

  //noti
  countNoti: any;

  loginUsername: string = '';
  loginUserId: String = '';

  //socket loading realtime
  public serverMessages = new Array<any>();
  serverMessagesLength: any;
  public isSendingMessage: any;
  public sender = '';
  listStatus= new Array<any>();
  listStatusItems= new Array<any>();
  selectStatus: any;
  reason: any;
  showCancelDialog: boolean;
  itemSelected: any;

  constructor(
    private smartControlService: SmartControlService,
    private ttsservice: TtsServiceService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private dialog: MatDialog,
    private dataService: SmartControlDataService,
    private socketService: WebsocketService,
    private confirmationService: ConfirmationService
  ) {
    this.data = {
      labels: this.barChartLabels,
      datasets: [],
    };
    this.options = [
      {label: 'AIS', value: 'AIS'}, 
      {label: '3BB', value: '3BB'}
    ];
  }

  options: SelectItem[];
  companyActivityMode: string = "AIS";

  async ngOnInit() {
    this.loading = true;
    this.listWrOnProcess = new Array<any>();
    this.countNoti = 0;
    if (!localStorage.profile) {
      // this.smartcontrolUtil.logout();
      // this.lockScreen.unLockScreen();
    }
    let parseProfile = JSON.parse(localStorage.profile);
    this.userProfile = parseProfile;
    this.searchUsername = parseProfile.name;
    this.loginUsername = parseProfile.name;
    this.loginUserId = parseProfile.id ? parseProfile.id : parseProfile.pid;

    //connect socket service
    this.socketService.connect();
    this.sender = parseProfile.name;
    this.serverMessages = this.socketService.serverMessages;
    this.serverMessagesLength = this.serverMessages.length;

    let loginTime = new Date(parseProfile.lastLogin);
    this.checkDefaultTime(loginTime);
    this.editCriteria.startDate = formatDate(
      this.defaultStartTime,
      'dd/MM/yyyy HH:mm',
      'en-US'
    );
    this.editCriteria.finishDate = formatDate(
      this.defaultEndTime,
      'dd/MM/yyyy HH:mm',
      'en-US'
    );
    this.startDate = this.initDate(this.editCriteria.startDate);
    this.finishDate = this.initDate(this.editCriteria.finishDate);

    this.onLoadFilterAndDashboard();
    this.setNoti();
    this.getStatusList();
    this.loading = false;
  }

  ngAfterViewInit() {
    // //Interval get count Noti
    var that = this;
    let timerId = setTimeout(function tick() {
      that.setNoti();
      timerId = setTimeout(tick, 60000); // (*)
    }, 60000);
  }

  ngDoCheck() {
    if (
      this.serverMessages.length > this.serverMessagesLength &&
      this.socketService.serverMessages.length > 0
    ) {
      this.serverMessagesLength++;
      this.onReceiveMessage();
    }

    if (
      this.serverMessages.length == this.serverMessagesLength &&
      this.socketService.serverMessages.length > 0
    ) {
      this.socketService.serverMessages.pop();
      this.serverMessagesLength--;
    }
  }

  convertDate(date) {
    let splitDate = date.split(' ');
    let time = splitDate[1];
    let day = splitDate[0].split(/\//)[0];
    let month = splitDate[0].split(/\//)[1];
    let year = splitDate[0].split(/\//)[2];
    let completeDate = [month, day, year].join('/') + ' ' + time;
    return new Date(completeDate);
  }

  checkDefaultTime(currentDate: Date) {
    let startDate = new Date();
    startDate.setHours(6, 0, 0);
    let endDate = new Date();
    endDate.setHours(18, 0, 0);

    let AM0000 = new Date();
    AM0000.setHours(0, 0, 0, 0);
    let AM0600 = new Date();
    AM0600.setHours(6, 0, 0);
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(18, 0, 0);

    if (
      currentDate.getTime() >= AM0000.getTime() &&
      currentDate.getTime() <= AM0600.getTime()
    ) {
      this.defaultStartTime = yesterday;
      this.defaultEndTime = AM0600;
    } else {
      if (
        currentDate.getTime() > startDate.getTime() &&
        currentDate.getTime() < endDate.getTime()
      ) {
        this.defaultStartTime = startDate;
        this.defaultEndTime = endDate;
      } else {
        startDate.setHours(18, 0, 0);
        endDate.setDate(startDate.getDate() + 1);
        endDate.setHours(6, 0, 0);
        this.defaultStartTime = startDate;
        this.defaultEndTime = endDate;
      }
    }
  }

  initialDdlData() {
    this.listDropdownSystemByUser();
  }

  listDropdownSystemByUser(): void {
    this.smartControlService
      .listDropdownSystemByUser('U03696')
      .takeWhile((alive) => true)
      .subscribe(
        async (data) => {
          const result = data['data'];
          if (result && result.error.code === '000') {
            this.listSystem = result.dropdownList;
            if (this.listSystem && this.listSystem.length) {
              this.searchCriteria.system = this.listSystem[0].ddlValue;
            }
          }
        },
        (error) => {}
      );
  }

  listDropdownSystemGroupByUser(): void {
    this.ttsservice
      .listDropdownSystemGroupByUser('U03696')
      .takeWhile((alive) => true)
      .subscribe(async (data) => {
        const result = data['data'];
        if (result && result.error.code === '000') {
          this.listSystem = result.dropdownList;
          if (this.listSystem && this.listSystem.length) {
          }
        }
      });
  }

  onClickFilter() {
    this.dialog
      .open(UserFilterDialogComponent, {
        hasBackdrop: true,
        data: {
          filterData: this.filter,
        },
        width: '60%',
        panelClass: 'custom-dialog-container',
      })
      .afterClosed()
      .subscribe(async (result) => {
        if (result) {
          this.filter = result.filter;
          this.getDashboard((newItem) =>{
              
          });
        }
      });
  }

  prepareDataDashboard() {
    let objData = {};
    if (this.filter) {
      objData = {
        username: this.loginUsername,
        option: this.searchUsername == '' ? '2' : '1',
        startDateTime: this.editCriteria.startDate, //this.datepipe.transform(this.startDate, 'dd/MM/yyyy HH:mm' ),
        endDateTime: this.editCriteria.finishDate, //this.datepipe.transform(this.finishDate, 'dd/MM/yyyy HH:mm' ),
        systemGroup: this.filter.systemGroup,
        region: this.filter.region,
        activityType: this.filter.activityType,
        aliasNode: this.filter.aliasNode,
        status: this.filter.status ? this.filter.status.toUpperCase() : null,
        downtime: this.filter.downtime
          ? this.filter.downtime.toUpperCase()
          : null,
        scheduleConflict: this.filter.scheduleConflict
          ? this.filter.scheduleConflict.toUpperCase()
          : null,
        fbbImpact: this.filter.fbbImpact
          ? this.filter.fbbImpact.toUpperCase()
          : null,
        tbbImpact: this.filter.tbbImpact ? this.filter.tbbImpact.toUpperCase() : null,
        impact: this.filter.impactType,
        impactNri: this.filter.impactNRI,
        activityError: this.filter.activityError,
        corpDocStatus: this.filter.corpDocStatus,
        corpProductImpact: this.filter.corpProductImpact,
        remarkGroup: this.filter.remarkGroup,
        siteAccess: this.filter.siteAccess
          ? this.filter.siteAccess.toUpperCase()
          : null,
        wrActionAuto: this.filter.wrAction,
        importance: this.filter.importance,
        ska: this.filter.ska ? this.filter.ska.toUpperCase() : null,
        group: this.filter.group,
        ref1: this.powerFilter,
        ref2: this.searchUsername,
      };
    }
    return objData;
  }

  prepareDataDashboard3BB() {
    let objData = {};
    // if (this.filter) {
      objData = {
        username: this.loginUsername,
        option: this.searchUsername == '' ? '2' : '1',
        startDateTime: this.editCriteria.startDate, //this.datepipe.transform(this.startDate, 'dd/MM/yyyy HH:mm' ),
        endDateTime: this.editCriteria.finishDate, //this.datepipe.transform(this.finishDate, 'dd/MM/yyyy HH:mm' ),
        systemGroup: null,
        region: null,
        activityType: null,
        aliasNode: null,
        status: null,
        downtime: null,
        scheduleConflict: null,
        fbbImpact: null,
        impact: null,
        impactNri: null,
        activityError: null,
        corpDocStatus: null,
        corpProductImpact: null,
        remarkGroup: null,
        siteAccess: null,
        wrActionAuto: null,
        importance: null,
        ska: null,
        group: null,
        ref1: this.powerFilter,
        ref2: this.searchUsername,
      };
    // }
    return objData;
  }

  getDashboard(callback){
    // this.loading = true;
    let dataDashboard = this.prepareDataDashboard();
    this.smartControlService
      .getDashboard(dataDashboard)
      .takeWhile((alive) => true)
      .subscribe(
        async (data) => {
          const result = data;
          if (result && result.resultCode === '0') {
            this.listWrActivity = result.resultData.ascDashboardList;
            this.listWrActivityAll = Object.assign([], this.listWrActivity);
            this.listWrActivityFilter = Object.assign([], this.listWrActivity);

            let listData = [];
            listData.push(result.resultData.all.count);
            listData.push(result.resultData.confirm.count);
            listData.push(result.resultData.thirtyMin.count);
            listData.push(result.resultData.inProgress.count);
            listData.push(result.resultData.testMonitoring.count);
            listData.push(result.resultData.delay.count);
            listData.push(result.resultData.overtime.count);
            listData.push(result.resultData.complete.count);
            listData.push(result.resultData.completeWithError.count);
            listData.push(result.resultData.completeWithCondition.count);
            listData.push(result.resultData.fallback.count);
            listData.push(result.resultData.fallbackWithError.count);
            listData.push(result.resultData.cancel.count);
            listData.push(result.resultData.cancelWithUnexpected.count);

            let listColors = [];
            listColors.push(result.resultData.all.color);
            listColors.push(result.resultData.confirm.color);
            listColors.push(result.resultData.thirtyMin.color);
            listColors.push(result.resultData.inProgress.color);
            listColors.push(result.resultData.testMonitoring.color);
            listColors.push(result.resultData.delay.color);
            listColors.push(result.resultData.overtime.color);
            listColors.push(result.resultData.complete.color);
            listColors.push(result.resultData.completeWithError.color);
            listColors.push(result.resultData.completeWithCondition.color);
            listColors.push(result.resultData.fallback.color);
            listColors.push(result.resultData.fallbackWithError.color);
            listColors.push(result.resultData.cancel.color);
            listColors.push(result.resultData.cancelWithUnexpected.color);

            let objChartData = {
              data: listData,
              backgroundColor: listColors,
              hoverBackgroundColor: [],
              borderColor: [],
            };

            this.barChartData = [];
            this.data.datasets = [];

            this.barChartData.push(objChartData);
            this.data = {
              labels: this.barChartLabels,
              datasets: this.barChartData,
            };

            if (this.barChartStatus == 'All' || this.barChartStatus == '') {
              this.graphStatus = 'All';
              this.listWrActivity = this.listWrActivityAll;
            } else {
              this.listWrActivity = this.listWrActivityFilter.filter(
                (t) => t.statusActivityDesc === this.barChartStatus
              );
            }
            // this.loading = false;
          }
          callback(this.listWrActivity);
        },
        (error) => {
          this.confirmationService.confirm({
            message: error.message,
            rejectLabel: 'Close',
            key: 'errorDialog',
            acceptVisible: false,
          });
          // this.loading = false;
        }
      );
      
  }

  getDashboard3BB(callback){
    this.loading = true;
    let dataDashboard = this.prepareDataDashboard3BB();
    this.smartControlService
      .getDashboard3bb(dataDashboard)
      .takeWhile((alive) => true)
      .subscribe(
        async (data) => {
          const result = data;
          if (result && result.resultCode === '0') {
            this.listWrActivity = result.resultData.ascDashboardList;
            this.listWrActivityAll = Object.assign([], this.listWrActivity);
            this.listWrActivityFilter = Object.assign([], this.listWrActivity);

            let listData = [];
            listData.push(result.resultData.all.count);
            listData.push(result.resultData.confirm.count);
            listData.push(result.resultData.thirtyMin.count);
            listData.push(result.resultData.inProgress.count);
            listData.push(result.resultData.testMonitoring.count);
            listData.push(result.resultData.delay.count);
            listData.push(result.resultData.overtime.count);
            listData.push(result.resultData.complete.count);
            listData.push(result.resultData.completeWithError.count);
            listData.push(result.resultData.completeWithCondition.count);
            listData.push(result.resultData.fallback.count);
            listData.push(result.resultData.fallbackWithError.count);
            listData.push(result.resultData.cancel.count);
            listData.push(result.resultData.cancelWithUnexpected.count);

            let listColors = [];
            listColors.push(result.resultData.all.color);
            listColors.push(result.resultData.confirm.color);
            listColors.push(result.resultData.thirtyMin.color);
            listColors.push(result.resultData.inProgress.color);
            listColors.push(result.resultData.testMonitoring.color);
            listColors.push(result.resultData.delay.color);
            listColors.push(result.resultData.overtime.color);
            listColors.push(result.resultData.complete.color);
            listColors.push(result.resultData.completeWithError.color);
            listColors.push(result.resultData.completeWithCondition.color);
            listColors.push(result.resultData.fallback.color);
            listColors.push(result.resultData.fallbackWithError.color);
            listColors.push(result.resultData.cancel.color);
            listColors.push(result.resultData.cancelWithUnexpected.color);

            let objChartData = {
              data: listData,
              backgroundColor: listColors,
              hoverBackgroundColor: [],
              borderColor: [],
            };

            this.barChartData = [];
            this.data.datasets = [];

            this.barChartData.push(objChartData);
            this.data = {
              labels: this.barChartLabels,
              datasets: this.barChartData,
            };

            if (this.barChartStatus == 'All' || this.barChartStatus == '') {
              this.graphStatus = 'All';
              this.listWrActivity = this.listWrActivityAll;
            } else {
              this.listWrActivity = this.listWrActivityFilter.filter(
                (t) => t.statusActivityDesc === this.barChartStatus
              );
            }
            this.loading = false;
          }
          callback(this.listWrActivity);
        },
        (error) => {
          this.confirmationService.confirm({
            message: error.message,
            rejectLabel: 'Close',
            key: 'errorDialog',
            acceptVisible: false,
          });
          this.loading = false;
        }
      );
      
  }

  onCallBackAction(param) {
    if (param.actionCallBack == 'onDatePickerReturn') {
      // this.date1 = param.data

      this.onDatePickerReturn(param);
    } else if (param.actionCallBack == 'onClickNoti') {
      this.showNoti = false;
      this.acknowledgeNoti(param.data);
      this.gotoActivityDetail(param.data);
    } else if (param.actionCallBack == 'receiveSocketMessage') {
      // this.onReceiveMessage(param.data);
    }
  }

  onDatePickerReturn(data) {
    if (data.paramId === 'startDate') {
      this.editCriteria.startDate = data.data;
      this.startDate = data.dateResult;
    } else if (data.paramId === 'finishDate') {
      this.editCriteria.finishDate = data.data;
      this.finishDate = data.dateResult;
    }
  }

  initDate(data) {
    var dateTimeInit = null;
    if (data != 'Wait confirm date.') {
      if (this.datePickerType === 'DATE') {
        var dateInit = data.split('/').reverse().join('-');
        dateTimeInit = dateInit + 'T00:00';
      } else if (this.datePickerType === 'DATE_TIME') {
        var datesplit = data.split(' ');
        var dateInit = datesplit[0].split('/').reverse().join('-');
        var timeInit = datesplit[1];
        dateTimeInit = dateInit + 'T' + timeInit;
      }
      dateTimeInit = new Date(dateTimeInit);
    }

    return dateTimeInit;
  }

  queryDashboard() {
    this.listWrActivity =null;
    this.barChartStatus = '';
    let beforeDate = this.convertDate(this.editCriteria.startDate);
    beforeDate.setDate(beforeDate.getDate() + 2);
    let finistDate = this.convertDate(this.editCriteria.finishDate);
    if (finistDate.getTime() > beforeDate.getTime()) {
      this.confirmationService.confirm({
        message:
          'The start date and end date have an interval exceeding 48 hours.',
        rejectLabel: 'Close',
        key: 'warningDialog',
        acceptVisible: false,
      });
    } else {
      if(this.companyActivityMode === '3BB'){
        this.getDashboard3BB((newItem) =>{
              
        });
      }else{
        this.listWrOnProcess.push('ALL');
        this.getDashboard((newItem) =>{
          this.onClearWrFromListOnProcess('ALL');
        });
      }
      
    }
  }

  clearData() {
    this.searchUsername = this.userProfile.name;
    this.editCriteria.startDate = formatDate(
      this.defaultStartTime,
      'dd/MM/yyyy HH:mm',
      'en-US'
    );
    this.editCriteria.finishDate = formatDate(
      this.defaultEndTime,
      'dd/MM/yyyy HH:mm',
      'en-US'
    );
    this.startDate = this.initDate(this.editCriteria.startDate);
    this.finishDate = this.initDate(this.editCriteria.finishDate);
    this.powerFilter = '';
  }

  saveWRActivity(item, action): void {
    // this.loading = true;
    this.listWrOnProcess.push(item.wrId);
    let dataObj: any = {
      userName: this.loginUsername,
      userId: this.loginUserId,
      wrId: item.wrId,
      wrStatus: item.statusActivityId,
      action: action,
      wrStatusOld: null,
      almStatusBefore: item.almStatusBefore,
      canActionBtnEds: item.canActionBtnEds,
      canActionBtnFbb: item.canActionBtnFbb,
      edsStatusBefore: item.edsStatusBefore,
      fbbStatusBefore: item.fbbStatusBefore
    };

    if(action == 'CC' || action == 'CCUX'){
      dataObj.reason = this.reason ? this.reason : '';
    }

    this.smartControlService
      .saveWRActivity(dataObj)
      .takeWhile((alive) => true)
      .subscribe(
        async (data) => {
          const result = data;
          if (result && result.resultCode === '0') {
            this.sendMessage('reload_dashboard', item.workerList);
            this.getDashboard((newItemList) =>{
              // console.log(' ....... saveWRActivity getDashboard newItemList : ',newItemList);
              // console.log(' ....... saveWRActivity item : ',item,action);
               if(action === 'FIN'){
                this.prepareSendSms(item, newItemList, (newItem) => {
                  console.log("isSendSms newItem : " ,newItem);
                  if(newItem.fbbSumReport === 'Pass'){
                    if(this.canSentSMSFbb(newItem)){
                      this.sendSmsFBB(newItem);
                    }
                  }
                  
                });
              }
              this.onClearWrFromListOnProcess(item.wrId);
              this.messageService.add({
                severity: 'success',
                summary: 'Update status activity success.',
                detail: item.wrId,
              });
            });
            
            // this.loading = false;
            
            // if(action === 'FIN'){
              // this.prepareSendSms(item, (newItem) => {
              //   console.log("isSendSms newItem : " ,newItem);
              //   if(this.canSentSMSFbb(newItem)){
              //     this.sendSmsFBB(newItem);
              //   }
              // });
            // }
          } else {
            this.onClearWrFromListOnProcess(item.wrId);
            this.confirmationService.confirm({
              message: result.resultMessage,
              rejectLabel: 'Close',
              rejectButtonStyleClass: 'p-button-warning',
              key: 'errorDialog',
              acceptVisible: false,
            });
          }
          this.closeCancelDialog();
          // this.loading = false;
        },
        (error) => {
          this.confirmationService.confirm({
            message: error,
            header: 'Error',
            icon: 'pi pi-exclamation-triangle',
            rejectLabel: 'Close',
            key: 'errorDialog',
            acceptVisible: false,
          });
          this.closeCancelDialog();
          this.loading = false;
        }
      );
  }

  saveWRActivityALM(item, action): void {
    // this.loading = true;
    this.listWrOnProcess.push(item.wrId);
    let dataObj = {
      userName: this.loginUsername,
      userId: this.loginUserId,
      wrId: item.wrId,
      wrStatus: item.statusActivityId,
      action: action,
    };
    this.smartControlService
      .saveWRActivityALM(dataObj)
      .takeWhile((alive) => true)
      .subscribe(
        async (data) => {
          const result = data;
          if (result && result.resultCode === '0') {
            this.sendMessage('reload_dashboard', item.workerList);
            this.getDashboard((newItem) =>{
              this.onClearWrFromListOnProcess(item.wrId);
            });
            this.messageService.add({
              severity: 'success',
              summary: 'Check alarm success.',
              detail: item.wrId,
            });
          } else {
            this.onClearWrFromListOnProcess(item.wrId);
            this.confirmationService.confirm({
              message: result.resultMessage,
              header: 'Error '+item.wrId,
              rejectLabel: 'Close',
              rejectButtonStyleClass: 'p-button-warning',
              key: 'errorDialog',
              acceptVisible: false,
            });
          }
          // this.loading = false;
        },
        (error) => {
          this.confirmationService.confirm({
            message: error,
            header: 'Error '+item.wrId,
            icon: 'pi pi-exclamation-triangle',
            rejectLabel: 'Close',
            key: 'errorDialog',
            acceptVisible: false,
          });
          // this.loading = false;
        }
      );
  }

  saveWRActivityEDS(item, action): void {
    // this.loading = true;
    this.listWrOnProcess.push(item.wrId);
    let dataObj = {
      userName: this.loginUsername,
      userId: this.loginUserId,
      wrId: item.wrId,
      wrStatus: item.statusActivityId,
      action: action,
    };
    this.smartControlService
      .saveWRActivityEDS(dataObj)
      .takeWhile((alive) => true)
      .subscribe(
        async (data) => {
          const result = data;
          if (result && result.resultCode === '0') {
            this.sendMessage('reload_dashboard', item.workerList);
            this.getDashboard((newItem) =>{
              this.onClearWrFromListOnProcess(item.wrId);
            });
            this.messageService.add({
              severity: 'success',
              summary: 'Check EDS success.',
              detail: item.wrId,
            });
          } else {
            this.onClearWrFromListOnProcess(item.wrId);
            this.confirmationService.confirm({
              message: result.resultMessage,
              header: 'Error '+item.wrId,
              icon: 'pi pi-exclamation-triangle',
              rejectLabel: 'Close',
              key: 'errorDialog',
              acceptVisible: false,
            });
            // this.loading = false;
          }
        },
        (error) => {
          this.confirmationService.confirm({
            message: error,
            header: 'Error '+item.wrId,
            icon: 'pi pi-exclamation-triangle',
            rejectLabel: 'Close',
            key: 'errorDialog',
            acceptVisible: false,
          });
          // this.loading = false;
        }
      );
  }

  saveWRActivityFBB(item, action): void {
    // this.loading = true;
    this.listWrOnProcess.push(item.wrId);
    let dataObj = {
      userName: this.loginUsername,
      userId: this.loginUserId,
      wrId: item.wrId,
      wrStatus: item.statusActivityId,
      action: action,
    };
    this.smartControlService
      .saveWRActivityFBB(dataObj)
      .takeWhile((alive) => true)
      .subscribe(
        async (data) => {
          const result = data;
          if (result && result.resultCode === '0') {
            this.sendMessage('reload_dashboard', item.workerList);
            this.getDashboard((newItemList) =>{
              // console.log(' ....... saveWRActivityFBB getDashboard newItemList : ',newItemList);
              // console.log(' ....... saveWRActivityFBB item : ',item,action);
              //  // if(action === 'FIN'){
              //   this.prepareSendSms(item, newItemList, (newItem) => {
              //     console.log("isSendSms newItem : " ,newItem);
              //     if(this.canSentSMSFbb(newItem)){
              //       this.sendSmsFBB(newItem);
              //     }
              //   });
              // }
              this.onClearWrFromListOnProcess(item.wrId);
              this.messageService.add({
                severity: 'success',
                summary: 'Check FBB success.',
                detail: item.wrId,
              });
            });
          
          } else {
            this.onClearWrFromListOnProcess(item.wrId);
            this.confirmationService.confirm({
              message: result.resultMessage,
              rejectLabel: 'Close',
              rejectButtonStyleClass: 'p-button-warning',
              key: 'errorDialog',
              acceptVisible: false,
            });
          }
          // this.loading = false;
        },
        (error) => {
          this.confirmationService.confirm({
            message: error,
            header: 'Error',
            icon: 'pi pi-exclamation-triangle',
            rejectLabel: 'Close',
            key: 'errorDialog',
            acceptVisible: false,
          });
          // this.loading = false;
        }
      );
  }

  prepareSendSms(item, newItemList, callback) {
    console.log("  isSendSms item " , item);
    
    const result = newItemList.filter(wr => wr.wrId == item.wrId);
    console.log("  isSendSms result " , result);
    callback(result[0]);
  }

 
  gotoSmartCheck() {
    this.dataService.openLink('/smart-control/smart-check', null);
  }

  onClickProfile() {
    this.showUserprofile = true;
  }

  gotoActivityDetail(data) {
    console.log('gotoActivityDetail data : ',data);
    
    let actparam = {
      wrId: data.wrId,
      tabIndex: data.tabIndex ? data.tabIndex : null
    };

    this.dataService.openLink('/smart-control/activity-detail', actparam);
  }

  loadNoti() {
    this.showNoti = true;
    this.smartControlService
      .getAscNotification(this.userProfile.name)
      .takeWhile((alive) => true)
      .subscribe(
        async (data) => {
          const result = data;
          if (result && result.resultCode === '0') {
            this.dataNoti = result.resultData;
          }
        },
        (error) => {
          console.log('error ==> ', error);
        }
      );
  }

  setNoti() {
    this.smartControlService
      .getCountNotification(this.userProfile.name)
      .takeWhile((alive) => true)
      .subscribe(
        async (data) => {
          const result = data;
          if (result && result.resultCode === '0') {
            if (result.resultData == 0) {
              $('#notiBtn').removeAttr('data-badge');
            } else {
              $('#notiBtn').attr('data-badge', result.resultData);
            }
            if (Number(result.resultData) > Number(this.countNoti)) {
              this.countNoti = result.resultData;
              this.getDashboard((newItem) =>{
              
              });
            }
          }
        },
        (error) => {
          console.log('error ==> ', error);
        }
      );
  }

  acknowledgeNoti(data) {
    let noti = {
      username: this.userProfile.name,
      refId: null,
    };
    if (data) {
      noti.refId = data.id;
    }

    this.smartControlService
      .updateAscNotificationAck(noti)
      .takeWhile((alive) => true)
      .subscribe(
        async (data) => {
          const result = data;
          if (result && result.resultCode === '0') {
            // console.log('updateAckNotiById resul ==================== t',result);
            // this.dataNoti = result.resultData;
            // this.lockScreen.unLockScreen();
          }
        },
        (error) => {
          console.log('error ==> ', error);
          this.messageService.add({
            severity: 'error',
            summary: 'ERROR',
            detail: error.error,
          });
        }
      );

    if (this.countNoti > 0) {
      this.countNoti = 0;
      $('#notiBtn').removeAttr('data-badge');
    }
  }

  onDataSelect(e) {
    console.log(e);
    const abbreviation_status: any = [
      'Test & Mon.',
      'CMP with Err.',
      'CMP with Con.',
      'FB with Err.',
      'CC with Un Ex.',
    ];
    const fullname_status: any = [
      'Test & Monitoring',
      'Complete with Error',
      'Complete with Condition',
      'Fallback with Error',
      'Cancel with Unexpected',
    ];
    let isAbbr: boolean = false;

    const label = this.data.labels[e.element._index];
    abbreviation_status.forEach((val, idex) => {
      if (label == val) {
        this.barChartStatus = fullname_status[idex];
        isAbbr = true;
        return isAbbr;
      }
    });

    if (!isAbbr) {
      this.barChartStatus = label;
    }

    if (this.barChartStatus == 'All') {
      this.listWrActivity = this.listWrActivityAll;
      this.graphStatus = this.barChartStatus;
    } else {
      this.listWrActivity = this.listWrActivityFilter.filter(
        (t) => t.statusActivityDesc === this.barChartStatus
      );
      this.graphStatus = this.barChartStatus;
    }
  }

  async sendMessage(clientMessage: string, receiver: any) {
    // const message = new Message(this.sender, this.clientMessage, this.isBroadcast);
    // console.log('=============sendMessage Be=> ',this.serverMessages);
    // console.log('=============receiver Be=> ',receiver);
    this.isSendingMessage = await this.socketService.sendMessage(
      clientMessage,
      true,
      this.sender,
      receiver
    );
  }

  onReceiveMessage() {
    if (this.serverMessages) {
      let msg = this.serverMessages[this.serverMessages.length - 1];
      if (msg.receiver && msg.receiver.indexOf(this.userProfile.name) >= 0) {
        let functionName = msg.content;
        switch (functionName) {
          case 'reload_dashboard':
            this.getDashboard((newItem) =>{
              
            });
            this.setNoti();
            break;

          default:
            break;
        }
      }
    }
  }

  onLoadFilterAndDashboard() {
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
            this.filter = result.resultData;
          } else {
            console.log(result.resultMessage);
          }
          this.getDashboard((newItem) =>{
              
          });
        },
        (error) => {
          this.confirmationService.confirm({
            message: error,
            header: 'Error',
            icon: 'pi pi-exclamation-triangle',
            rejectLabel: 'Close',
            acceptVisible: false,
          });
          this.filter = {};
          this.getDashboard((newItem) =>{
              
          });
        }
      );
  }

  canSentSMSFbb(item){
    // console.log('-----canSentSMSFbb ----');
    // console.log(this.listWRStatusCanSendSMS.includes(item.statusActivityId));
    // console.log(item.ainStatusId === '03');
    // console.log(item.fbbSumReport === 'Pass');
    // console.log('---------',(this.listWRStatusCanSendSMS.includes(item.statusActivityId) && item.ainStatusId === '03' && item.fbbSumReport === 'Pass'));
    return (((this.listWRStatusCanSendSMSCompleteFlow.includes(item.statusActivityId) && (item.countAllFbb == item.countChkAtFbb))
    || this.listWRStatusCanSendSMSCancelFlow.includes(item.statusActivityId))
    && item.ainStatusId === '03' );
  }

  sendSmsFBB(item){
    // this.loading = true;
    this.listWrOnProcess.push(item.wrId);
    let smsAction = '';
    if(this.listWRStatusCanSendSMSCompleteFlow.includes(item.statusActivityId) ){
      smsAction = 'COMPLETE';
    }else if(this.listWRStatusCanSendSMSCancelFlow.includes(item.statusActivityId)){
      smsAction = 'CANCEL';
    }

    console.log('......sendSmsFBB smsAction : ',smsAction);
    
    this.smartControlService.sendSmsFBB(
        this.userProfile.name,
        this.userProfile.id ? this.userProfile.id : this.userProfile.pid,
        item.wrId,
        item.ainId,
        item.fbbSumReport,
        item.startDate, 
        item.lastUpdateDate,
        smsAction
      ).takeWhile((alive) => true).subscribe(async (data) => {
          const result = data;
          if (result && result.resultCode === '0') {
            console.log('..........sendSmsFBB result : ',result);
            let resultData = result.resultData
            let data = {
              wrId: item.wrId,
              tabIndex: resultData.tabIndex ? resultData.tabIndex : null
            }
            
            switch (resultData.sms_action) {
              case 'autoSendSMS':
                this.sendMessage('reload_dashboard', item.workerList);
                this.getDashboard((newItem) =>{
                  this.onClearWrFromListOnProcess(item.wrId);
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Send SMS success.',
                    detail: item.wrId,
                  });
                });
                
                break;
              case 'manualSendSMS':
                this.onClearWrFromListOnProcess(item.wrId);
                this.messageService.add({
                  severity: 'info',
                  summary: 'Please manual send SMS.',
                  detail: item.wrId,
                });
                break;
              case 'redirect':
                this.onClearWrFromListOnProcess(item.wrId);
                this.gotoActivityDetail(data);
                break;
              default:
                break;
            }
            
            // this.sendMessage('reload_dashboard', item.workerList);
            
            
          } else {
            this.onClearWrFromListOnProcess(item.wrId);
            this.confirmationService.confirm({
              message: result.resultMessage,
              header: 'Error '+item.wrId,
              rejectLabel: 'Close',
              rejectButtonStyleClass: 'p-button-warning',
              key: 'errorDialog',
              acceptVisible: false,
            });
          }
          // this.loading = false;
        },
        (error) => {
          this.onClearWrFromListOnProcess(item.wrId);
          this.confirmationService.confirm({
            message: error,
            header: 'Error '+item.wrId,
            icon: 'pi pi-exclamation-triangle',
            rejectLabel: 'Close',
            acceptVisible: false,
          });
          this.filter = {};
          this.getDashboard((newItem) =>{
              
          });
        }
      );
  }

  confirmSaveActivity(item: any, action: string): void {
    if(action == 'STA'){
      let currentDate = moment(new Date());
      let startDate = moment(item.startDate);
      let diff = currentDate.diff(startDate, 'minutes');
      if(diff <= -30){
        this.confirmationService.confirm({
          message:'ยังไม่ถึงเวลาเริ่ม Activity คุณแน่ใจใช่ไหมว่าต้องการกดเริ่ม Activity',
          acceptLabel: 'Yes',
          rejectLabel: 'No',
          key: 'warningDialog',
          acceptVisible: true,
          rejectButtonStyleClass:'p-button-warning',
          accept: () => {
            this.saveWRActivity(item, action);
          }
        });
      }else{
        this.saveWRActivity(item, action);
      }
    }else if(action == 'CC'){
      this.openCancelDialog(item);
    }
  }

  getStatusList() {
    this.ttsservice
      .listStatusActForKeyIn('U03696')
      .takeWhile((alive) => true)
      .subscribe(
        async (data: any) => {
          const result = data;
          if (result && result.resultCode == '0') {
            let statusList = result.resultData;
            if (statusList && statusList.length > 0) {
              statusList.forEach((el: any) => {
                if(el.statusId == 'CANCEL' || el.statusId == 'CANCEL_WITH_UNEXPECTED'){
                  this.listStatus.push(el);
                }
              });
            }
          }

          console.log(this.listStatus);
        },
        (error) => {
          // this.loading = false;
        }
      );
  }

  openCancelDialog(item: any){
    this.selectStatus = {};
    this.reason = '';
    this.showCancelDialog = true;
    this.itemSelected = item;
    this.listStatusItems = this.listStatus;
  }

  closeCancelDialog(){
    this.showCancelDialog = false;
    this.itemSelected = {};
  }

  onSaveCancelDialog(){
    if(this.selectStatus?.statusId){
      if(this.reason){
        let status = 'CC';
        if(this.selectStatus.statusId == 'CANCEL_WITH_UNEXPECTED'){
          status = 'CCUX';
        }
        this.saveWRActivity(this.itemSelected, status);
      }else{
        this.confirmationService.confirm({
          message:'กรุณากรอกข้อมูล Reason',
          rejectLabel: 'Cancel',
          key: 'warningDialog',
          acceptVisible: false,
          rejectButtonStyleClass:'p-button-warning'
        });
      }
    }else{
      this.confirmationService.confirm({
        message:'กรุณาเลือก Status',
        rejectLabel: 'Cancel',
        key: 'warningDialog',
        acceptVisible: false,
        rejectButtonStyleClass:'p-button-warning'
      });
    }
  }

  gotoActivityDetail3BB(data) {
    console.log('gotoActivityDetail3BB data : ',data);
    
    let actparam = {
      wrId: data.wrId,
      tabIndex: data.tabIndex ? data.tabIndex : null
    };

    this.dataService.openLink('/smart-control/activity-detail-tbb', actparam);
  }

  saveWRActivityFBB3BB(item, action): void {
    this.loading = true;
    console.log(' ......... saveWRActivityFBB3BB item : ',item, action);
    let dataObj = {
      userName: this.loginUsername,
      userId: this.loginUserId,
      wrId: item.wrId,
      wrStatus: item.statusActivityId,
      action: action,
    };
    this.smartControlService
      .saveWRActivityFBB3BB(dataObj)
      .takeWhile((alive) => true)
      .subscribe(
        async (data) => {
          const result = data;
          if (result && result.resultCode === '0') {
            // this.sendMessage('reload_dashboard', item.workerList);
            this.getDashboard3BB((newItemList) =>{
              // console.log(' ....... saveWRActivityFBB getDashboard newItemList : ',newItemList);
              // console.log(' ....... saveWRActivityFBB item : ',item,action);
              //  // if(action === 'FIN'){
              //   this.prepareSendSms(item, newItemList, (newItem) => {
              //     console.log("isSendSms newItem : " ,newItem);
              //     if(this.canSentSMSFbb(newItem)){
              //       this.sendSmsFBB(newItem);
              //     }
              //   });
              // }
              this.messageService.add({
                severity: 'success',
                summary: 'success',
                detail: item.wrId,
              });
            });
          
          } else {
            console.log(' saveWRActivityFBB3BB result.resultMessage ',result.resultMessage);
            this.confirmationService.confirm({
              message: result.resultMessage,
              header: 'Error '+item.wrId,
              rejectLabel: 'Close',
              rejectButtonStyleClass: 'p-button-warning',
              key: 'errorDialog',
              acceptVisible: false,
            });
          }
          this.loading = false;
        },
        (error) => {
          console.log(' saveWRActivityFBB3BB error ',error);
          this.confirmationService.confirm({
            message: error.message,
            header: 'Error '+item.wrId,
            icon: 'pi pi-exclamation-triangle',
            rejectLabel: 'Close',
            key: 'errorDialog',
            acceptVisible: false,
          });
          this.loading = false;
        }
      );
  }

  onClearWrFromListOnProcess( wrId){
    const index = this.listWrOnProcess.indexOf(wrId, 0);
    if (index > -1) {
      this.listWrOnProcess.splice(index, 1);
    }
  } 
}
