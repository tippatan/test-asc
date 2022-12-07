import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ActivityDetail } from 'app/models/activity-detail';
import { AuthService } from 'app/services/auth.service';
import { SmartControlService } from 'app/services/smart-control.service';
import { TtsServiceService } from 'app/services/tts-service.service';
import { ConfirmationService, MessageService } from 'primeng-lts/api';
import { TimelineItem } from '../shares/component/timeline-horizontal/timeline-item';
import { WebsocketService } from 'app/web-socket.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { FileAttachActm } from 'app/models/file-attach-actm.model';
import { FileManagementService } from 'app/services/file-management.service';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-activity-detail',
  templateUrl: './activity-detail.component.html',
  styleUrls: ['./activity-detail.component.scss'],
})
export class ActivityDetailComponent implements OnInit {
  loading: boolean = false;
  tableLoading: boolean = false;

  tabLoadTimes: Date[] = [];
  activityDetailObj = new ActivityDetail();
  dataMaster: any = {};
  listStatus: Array<any>;
  selectStatus: any;

  datePickerType: string = 'DATE_TIME';
  datePickerMode: string = 'EDIT';
  autoAlarmChecking: boolean;
  autoServiceChecking: boolean;

  listAlarmSiteCode: any;
  listAlarmService: any;
  listAlarmEnterprise: any;
  start = new Date(2001, 0, 1);
  end = new Date();

  items: TimelineItem[] = [];

  reqData: any;
  wrId: string;
  wrStatus: string;
  nocSelect: string;

  userProfile: any;

  titleHeader: string;

  checkSiteCode = 'N';
  checkService = 'N';
  checkEnterprise = 'N';

  //socket loading realtime
  public serverMessages = new Array<any>();
  serverMessagesLength: any;
  public isSendingMessage: any;
  public sender = '';
  receiver: any;
  tabIndex:string = '0';

  listWRStatusCanSendSMSCompleteFlow: any = [
    'IN_PROGRESS',
    'TEST_MONITORING',
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

  smsType: string;
  ainId: string;
  reload: any;

  uploadedFilesAttach:  FileAttachActm[] = [];

  isAttachFileDialogDisplay: boolean;

  // attachFile
  // attachFile
  attachFileList: any[] = [];
  uploadedFiles: any[] = [];
  uploadedExcelFiles: any[] = [];
  selectedFiles: any[] = [];
  fileUploadSuccessList: any;
  pathDownLoadFile: string = 'BOM_LOAD_CTM_JOB_TEMPLATE_PATH';
  deleteAttachFileList: any[] = [];

  // uploadedExcelFiles: FileAttachActm[] = [];
  // selectedFiles: FileAttachActm[] = [];
  // fileUploadSuccessList: any[] = [];
  // pathDownLoadFile: string = 'BOM_LOAD_CTM_JOB_TEMPLATE_PATH';
  // deleteAttachFileList: string[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private smartControlService: SmartControlService,
    private ttsService: TtsServiceService,
    private authenService: AuthService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private socketService: WebsocketService,
    private fileManagement: FileManagementService
  ) {}

  async ngOnInit() {
    this.userProfile = JSON.parse(localStorage.profile);
    this.uploadedFiles =  [];
    this.attachFileList = [];
    this.fileUploadSuccessList = [];
    this.deleteAttachFileList = [];
    this.authenService.refreshToken();
    this.activatedRoute.queryParams.subscribe((params: ParamMap) => {
      if (params['param'] || params['userLogin'] != '') {
        let param = params['data'];

        let decodeParam = JSON.parse(atob(param));
        this.reqData = decodeParam;
        this.wrId = this.reqData.wrId;
        // this.tabIndex = this.reqData.tabIndex ? this.reqData.tabIndex : '0';
      }
    });

    //connect socket service
    this.socketService.connect();
    this.sender = this.userProfile.name;
    this.serverMessages = this.socketService.serverMessages;
    this.serverMessagesLength = this.serverMessages.length;

    this.selectStatus = null;
    this.activityDetailObj.autoAlarmChecking = false;
    this.activityDetailObj.alarmCheckingDate = '';
    this.activityDetailObj.autoServiceChecking = false;
    this.activityDetailObj.serviceCheckingDate = '';

    await this.onListStatusActForKeyIn();
    await this.getActivityDetail();
    await this.getActivityService();
    
  }

  getActivityDetail(): void {
    this.smartControlService.getActivityDetail(this.wrId, this.userProfile.name).takeWhile((alive) => true).subscribe(
       (data) => {
          const result = data;
          if (result && result.resultCode === '0') {
            this.dataMaster = result.resultData;

            this.titleHeader = this.dataMaster.controlDetail.title;
            this.wrStatus = this.dataMaster.controlDetail.statusActivityId;
            let objWrStatus = {
              statusId: this.dataMaster.controlDetail.statusActivityId,
            };
            this.ainId = this.dataMaster.controlDetail.ainId;
            this.selectStatus = objWrStatus;
            this.activityDetailObj.smsType = this.canSentSMSFbb(this.selectStatus);
            this.activityDetailObj.autoAlarmChecking = this.dataMaster.controlDetail.autoCheckAlarmFlag == 'Y' ? true : false;
            this.activityDetailObj.autoServiceChecking = this.dataMaster.controlDetail.autoCheckServiceFlag == 'Y' ? true : false;

            if (this.dataMaster.controlDetail.autoCheckAlarmDate != null) {
              this.activityDetailObj.alarmCheckingDate = this.dataMaster.controlDetail.autoCheckAlarmDate;
            }
            if (this.dataMaster.controlDetail.autoCheckServiceDate != null) {
              this.activityDetailObj.serviceCheckingDate = this.dataMaster.controlDetail.autoCheckServiceDate;
            }

            this.activityDetailObj.reason = this.dataMaster.controlDetail.reason;

            this.dataMaster.controlDetail.node = this.dataMaster.controlDetail.node.split(',');
            this.dataMaster.controlDetail.nodeRelated = this.dataMaster.controlDetail.nodeRelated.split(',');

            if (this.dataMaster.historyList) {
              this.items = this.dataMaster.historyList.map((history) => history as TimelineItem);
            }
            this.dataMaster.activityHistory = this.items;

            if (this.dataMaster.uploadedFileList) {
              this.uploadedFilesAttach = this.dataMaster.uploadedFileList.map((masterFiles) => masterFiles as FileAttachActm);
              this.uploadedFiles = this.dataMaster.uploadedFileList;
              this.attachFileList = this.uploadedFiles.map(file =>  file as object);
              // this.uploadedFiles = this.dataMaster.uploadedFileList.map(object => {
              //   return new File([object], object.fileName, {lastModified: object.updateDate});
              // });
             

            }
            // console.log('-============this.uploadedFiles : ',this.uploadedFiles);

            this.activityDetailObj.alarmSiteCodeNote = this.dataMaster.controlDetail.alarmSiteCodeNote;
            this.activityDetailObj.alarmServiceNote = this.dataMaster.controlDetail.alarmServiceNote;
            this.activityDetailObj.alarmEnterpriseNote = this.dataMaster.controlDetail.alarmEnterpriseNote;
            this.activityDetailObj.serviceEnterpriseNote = this.dataMaster.controlDetail.serviceEnterpriseNote;
            this.activityDetailObj.serviceFbbNote = this.dataMaster.controlDetail.serviceFbbNote;

            if (this.dataMaster.workerList) {
              this.receiver = [];

              this.dataMaster.workerList.forEach((element) => {
                if (this.receiver.indexOf(element.username) < 0) {
                  this.receiver.push(element.username);
                }
              });
            }

            // this.tabIndex = this.reqData.tabIndex ? this.reqData.tabIndex : '0';
          }
        },
        (error) => {
          this.confirmationService.confirm({
            message: error.message,
            rejectLabel: 'Close',
            rejectButtonStyleClass: 'p-button-warning',
            key: 'errorDialog',
            acceptVisible: false,
          });
          this.loading = false;
        }
      );
  }

  onListStatusActForKeyIn() {
    this.ttsService
      .listStatusActForKeyIn('U03696')
      .takeWhile((alive) => true)
      .subscribe(
        async (data) => {
          const result = data;

          if (result && result.resultCode == '0') {
            this.listStatus = result.resultData;
            if (this.listStatus && this.listStatus.length) {
              return true;
            }
          }
        },
        (error) => {
          this.loading = false;
        }
      );
  }

  randomDate(start, end) {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  }

  onTabLoaded(index: number) {
    // console.log('getTimeLoaded : ', index);

    if (!this.tabLoadTimes[index]) {
      this.tabLoadTimes[index] = new Date();
    }

    return this.tabLoadTimes[index];
  }

  onConfirmClose() {
    this.confirmationService.confirm({
      message: 'Are you sure to close this tab ?',
      rejectButtonStyleClass: 'p-button-warning',
      key: 'warningDialog',
      accept: () => {
        window.close();
      },
      reject: () => {},
    });
  }

  onChecker(type: any, isChecked: boolean) {
    if (type === 'alarm') {
      this.activityDetailObj.autoAlarmChecking = isChecked;
    } else if (type === 'service') {
      this.activityDetailObj.autoServiceChecking = isChecked;
    }
  }

  async onCallBackAction(data) {
    if (data) {
      if (data.actionCallBack == 'onCheckFBB') {
        let dataList = [];
        dataList.push(data.data);
        this.activityCheckFBB(dataList);
      } else if (data.actionCallBack == 'onCheckAllFBB') {
        this.activityCheckFBB(data.data);
      } else if (data.actionCallBack == 'onCheckAllAlarm') {
        // console.log('onCallBackAction activity detail >> ', data);

        if (data.data.rowList.length > 0) {
          let dataList = [];
          dataList.push(data.data);
          if (data.data.alarmType == 'Site Code') {
            this.activityCheckAlarmSiteCode(
              data.data.rowList,
              true,
              data.index
            );
          } else if (data.data.alarmType == 'Service') {
            this.activityCheckAlarmService(data.data.rowList, true, data.index);
          } else if (data.data.alarmType == 'Enterprise') {
            this.activityCheckAlarmEnterprise(
              data.data.rowList,
              true,
              data.index
            );
          }
        } else {
          this.activityCheckAllAlarm();
        }
      } else if (data.actionCallBack == 'onCheckAlarm') {
        let dataList = [];
        dataList.push(data.data);
        if (data.data.alarmType == 'Site Code') {
          this.activityCheckAlarmSiteCode(dataList, false, data.index);
        } else if (data.data.alarmType == 'Service') {
          this.activityCheckAlarmService(dataList, false, data.index);
        } else if (data.data.alarmType == 'Enterprise') {
          this.activityCheckAlarmEnterprise(dataList, false, data.index);
        }
      }
      if (data.actionCallBack == 'onCheckEnterprise') {
        let dataList = [];
        dataList.push(data.data);
        this.activityCheckEnterprise(dataList);
      } else if (data.actionCallBack == 'onCheckAllEnterprise') {
        this.activityCheckEnterprise(data.data);
      } else if (data.actionCallBack == 'noc') {
        this.dataMaster.nocList = data.data;
        this.nocSelect = data.data.map((ddl) => ddl.nocName);
        if(this.reqData.tabIndex){
          // console.log('--------------------------this.tabIndex = this.reqData.tabIndex;',this.reqData.tabIndex);
          this.tabIndex = this.reqData.tabIndex;
        }
      }else if(data.actionCallBack == 'onSendSMSById'){
        // console.log(' onSendSMSById : ',data);
        // console.log(' activityDetailObj.serviceFBB ',this.activityDetailObj.serviceFBB);

        await this.sendSmsFBBById();
      }else if(data.actionCallBack == 'onDownloadDocument'){
        this.onDownloadDocument(data.data);
      }else if(data.actionCallBack == 'onDeleteDocument'){
        // this.onDeleteDocument(data.data);
        this.deleteAttachFile(data.data);
      }else if(data.actionCallBack == 'onRefresh'){
        this.getActivityDetail();
      }else if(data.actionCallBack == 'onOpenAttachFileDialog'){
        this.openAttachFileDialog();
      }
    }
  }

   // attachFile
   openAttachFileDialog() {
    // this.uploadedFiles = this.attachFileList.value;
    this.isAttachFileDialogDisplay = true;
  }

  // getListFileUploadSuccess(event) {
  //   console.log('--------------getListFileUploadSuccess, event', event,this.uploadedFiles);
  //   const pattern = /^[a-zA-Z0-9._-\s()]*$/;
  //   let fileName = event.name;
  //   let validateFileName = pattern.exec(fileName);
  //   let dupFileName = this.uploadedFiles.filter(//file => file.fileName == event.name
  //     (res) => res.fileName == event.name
  //   );
  //   console.log('--------------getListFileUploadSuccess, dupFileName, ',dupFileName);
  //   if (validateFileName && dupFileName.length == 0) {
  //     const myArray = fileName.split('.', 2);
  //     event.fileExtension = myArray[1].toUpperCase();
  //     event.fileSize = Math.trunc(event.size / 1000);
  //     console.log('--------------getListFileUploadSuccess, event.fileExtension, ',validateFileName, event.fileExtension, event.fileSize);
  //     // this.fileUploadSuccessList = event;
  //     this.fileUploadSuccessList.push(event);
  //     // const attachList = this.uploadedFiles;
  //     let tempFile  = {
  //       fileName: event.name,
  //       fileSize: event.size,
  //       fileExtension: event.fileExtension
  //     };
  //     // tempFile.fileName = event.name;
  //     // tempFile.fileSize = event.size;
  //     // tempFile.fileExtension = event.fileExtension;

  //     // this.uploadedFiles.push(tempFile as FileAttachActm);

  //     this.uploadedFiles = [...this.uploadedFiles, tempFile as FileAttachActm];
      
  //     console.log('--------------getListFileUploadSuccess, this.fileUploadSuccessList, ', this.fileUploadSuccessList,this.uploadedFiles,dupFileName);
      
  //     // console.log(attachList)
  //     // this.attachFileList.patchValue(attachList);
  //     // this.uploadedFiles = this.attachFileList.value;
  //     // console.log(this.attachFileList.value);
  //     this.isAttachFileDialogDisplay = false;
  //   } else {
  //     if(dupFileName){
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'error',
  //         detail: 'upload file duplicate',
  //       });
  //     }else{
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'error',
  //         detail: 'upload file error',
  //       });
  //     }
      
  //   }
  // }

  // deleteAttachFile(event) {
  //   console.log('--------- deleteAttachFile event : ',event);
  //   let attachList = this.uploadedFiles;
  //   attachList = attachList.filter(
  //     (res) => res.id != event.id || res.fileName != event.fileName
  //   );
  //   this.fileUploadSuccessList.filter(
  //     (res) => res.id != event.id || res.fileName != event.fileName
  //   );
  //   // console.log(attachList)
  //   // console.log(this.attachFileList)
  //   // this.attachFileList.patchValue(attachList);
  //   // this.uploadedFiles = this.attachFileList.value;
  //   this.uploadedFiles = attachList
  //   // console.log(this.attachFileList.value);
  //   if (event.id) {
  //     this.deleteAttachFileList.push(event.id);
  //   }
  //   console.log('--------- deleteAttachFile : this.deleteAttachFileList',this.deleteAttachFileList,this.fileUploadSuccessList,this.uploadedFiles);
  // }

  getListFileUploadSuccess(event) {
    console.log('--------------getListFileUploadSuccess, event', event,this.uploadedFiles);
    const pattern = /^[a-zA-Z0-9._-\s()]*$/;
    let fileName = event.name;
    let validateFileName = pattern.exec(fileName);
    if (validateFileName) {
      const myArray = fileName.split('.', 2);
      event.typeOfAttachFile = myArray[1].toUpperCase();
      event.sizeOfAttachFile = Math.trunc(event.size / 1000);

      // this.fileUploadSuccessList = event;
      // const attachList = this.attachFileList;
      // attachList.push(event);
      // console.log('--------------getListFileUploadSuccess, this.attachFileList', this.attachFileList);
      // console.log(attachList)
      // this.attachFileList = { ...attachList };
      
      //for save activity
      this.fileUploadSuccessList.push(event);
      //for user command
      this.uploadedFiles.push(event);
      this.attachFileList = this.uploadedFiles.map(file =>  file as object);
      console.log('--------------getListFileUploadSuccess, this.uploadedFiles', this.fileUploadSuccessList, this.uploadedFiles);
      // console.log(this.attachFileList.value);
      this.isAttachFileDialogDisplay = false;
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'error',
        detail: 'upload file error',
      });
    }
  }

  deleteAttachFile(event) {
    console.log(' start deleteAttachFile : ',event,this.uploadedFiles,this.fileUploadSuccessList);
    if(event.id && event.fileName){
      this.uploadedFiles = this.uploadedFiles.filter(
        (res) => res.id != event.id || res.fileName != event.fileName
      );

      this.deleteAttachFileList.push(event.id);
    }else{
      this.uploadedFiles = this.uploadedFiles.filter(
        (res) => res != event
      );

      this.fileUploadSuccessList = this.fileUploadSuccessList.filter(
        (res) => res != event
      );
    }
    console.log(' end deleteAttachFile : ',event,this.uploadedFiles,this.fileUploadSuccessList,this.deleteAttachFileList);
    // let attachList = this.uploadedFiles;
    // attachList = attachList.filter(
    //   (res) => res.attach_id != event.attach_id || res.name != event.name
    // );
    // console.log(attachList)
    // console.log(this.attachFileList)
    // this.attachFileList = { ...attachList };
    // this.uploadedFiles = { ...this.attachFileList};
    // console.log(event.attach_id);
    // if (event.attach_id) {
    //   this.deleteAttachFileList.push(event);
    // }
  }

  getSelectedFiles(event) {
    console.log(event);
  }

  onDownloadDocument(files: FileAttachActm){
    this.fileManagement.downloadFileWR(files.filePath, files.id, files.fileExtension).subscribe(res => {
      // console.log('onDownloadDocument res : ',res)
      // console.log(' onDownloadDocument res.headers : ',res.headers);
      // console.log(' onDownloadDocument res.body : ',res.body);
      // console.log(' onDownloadDocument content-disposition : ',res.headers.get('content-disposition'));
      // let filename = decodeURI(res.headers.get('Content-Disposition'));
      // const FILENAME_INDEX = 1;
      // filename = filename.split('|')[FILENAME_INDEX];
      FileSaver.saveAs(res.body, files.fileName);
    })
  }

  onDeleteDocument(files){
    this.loading = true;
    // let userId = this.userProfile.id ? this.userProfile.id : this.userProfile.pid;
    files.updateBy = this.userProfile.id ? this.userProfile.id : this.userProfile.pid;
    this.deleteAttachFileList.push(files.id);
    // this.fileManagement.deleteFileWR(files).takeWhile((alive) => true).subscribe(
    //   (data) => {
    //      const result = data;
    //      if (result && result.resultCode === '0') {
    //         this.sendMessage('reload_dashboard', this.receiver);
    //         // this.clearData();
    //         this.onRefresh((newItem) =>{
            
              
    //           this.messageService.add({
    //             severity: 'success',
    //             summary: 'Success',
    //             detail: 'WR document has been saved.',
    //           });
    //           return true;
    //         });
    //         // this.fetchDataAfterSave();
    //       } else {
    //         this.loading = false;
    //         this.confirmationService.confirm({
    //           message: result.resultMessage,
    //           rejectLabel: 'Close',
    //           rejectButtonStyleClass: 'p-button-warning',
    //           key: 'errorDialog',
    //           acceptVisible: false,
    //         });
    //       }
    //     },
    //     (error) => {
    //       this.confirmationService.confirm({
    //         message: error.message,
    //         rejectLabel: 'Close',
    //         rejectButtonStyleClass: 'p-button-warning',
    //         key: 'errorDialog',
    //         acceptVisible: false,
    //       });
          this.loading = false;
    //     }
    //   );
  }

  clearData() {
    this.wrStatus = null;
    this.selectStatus = null;
    this.activityDetailObj = new ActivityDetail();
    this.items = [];
    this.checkSiteCode = 'N';
    this.checkService = 'N';
    this.checkEnterprise = 'N';
  }

  async onConfirmSave() {
    await this.saveActivityDetail();
    
  }

  async saveActivityDetail() {
    let planStartDate = this.convertDate(
      this.dataMaster.controlDetail.planStartDate
    );
    if (
      this.activityDetailObj.autoAlarmChecking &&
      (this.activityDetailObj.alarmCheckingDate == '' ||
        this.activityDetailObj.alarmCheckingDate == null)
    ) {
      this.confirmationService.confirm({
        message: 'Please select a date for alarm auto checking.',
        rejectLabel: 'Close',
        rejectButtonStyleClass: 'p-button-warning',
        key: 'warningDialog',
        acceptVisible: false,
      });
      return;
    }
    if (
      this.activityDetailObj.autoServiceChecking &&
      (this.activityDetailObj.serviceCheckingDate == '' ||
        this.activityDetailObj.serviceCheckingDate == null)
    ) {
      this.confirmationService.confirm({
        message: 'Please select a date for service auto checking.',
        rejectLabel: 'Close',
        rejectButtonStyleClass: 'p-button-warning',
        key: 'warningDialog',
        acceptVisible: false,
      });
      return;
    }
    if (this.activityDetailObj.alarmCheckingDate != null) {
      let alarmDate = this.convertDate(
        this.activityDetailObj.alarmCheckingDate
      );
      if (alarmDate.getTime() >= planStartDate.getTime()) {
        this.confirmationService.confirm({
          message:
            'The date of the alarm auto checking must be less than the date of the start date.',
          rejectLabel: 'Close',
          rejectButtonStyleClass: 'p-button-warning',
          key: 'warningDialog',
          acceptVisible: false,
        });
        return;
      }
    }
    if (this.activityDetailObj.serviceCheckingDate != null) {
      let serviceDate = this.convertDate(
        this.activityDetailObj.serviceCheckingDate
      );
      if (serviceDate.getTime() >= planStartDate.getTime()) {
        this.confirmationService.confirm({
          message:
            'The date of the service auto checking must be less than the date of the start date.',
          rejectLabel: 'Close',
          rejectButtonStyleClass: 'p-button-warning',
          key: 'warningDialog',
          acceptVisible: false,
        });
        return;
      }
    }

    let reason = this.activityDetailObj.reason;
    let status = this.selectStatus.statusId;
    if (
      status != 'CONFIRM' &&
      status != 'IN_PROGRESS' &&
      status != 'TEST_MONITORING' &&
      status != 'COMPLETE' &&
      status != 'VERIFY' &&
      (reason == '' || reason == null)
    ) {
      this.confirmationService.confirm({
        message: 'Please enter a reason.',
        rejectLabel: 'Close',
        rejectButtonStyleClass: 'p-button-warning',
        key: 'warningDialog',
        acceptVisible: false,
      });
      return;
    }
    this.loading = true;
    let dataObj = {
      wrId: this.wrId,
      wrStatus: this.selectStatus.statusId,
      wrStatusOld: this.wrStatus,
      userId: this.userProfile.id ? this.userProfile.id : this.userProfile.pid,
      userName: this.userProfile.name,
      reason: this.activityDetailObj.reason
        ? this.activityDetailObj.reason
        : '-',
      autoCheckAlarmFlag: this.activityDetailObj.autoAlarmChecking ? 'Y' : 'N',
      autoCheckAlarmDate: this.activityDetailObj.alarmCheckingDate,
      autoCheckServiceFlag: this.activityDetailObj.autoServiceChecking
        ? 'Y'
        : 'N',
      autoCheckServiceDate: this.activityDetailObj.serviceCheckingDate,
      informNocList: this.dataMaster.nocList.map((ddl) => ddl.nocName),
      alarmSiteCodeList: this.activityDetailObj.listAlarmSiteCode
        ? this.activityDetailObj.listAlarmSiteCode.filter(
            (p) => p.checkFlag === 'Y'
          )
        : '',
      alarmServiceList: this.activityDetailObj.listAlarmService
        ? this.activityDetailObj.listAlarmService.filter(
            (p) => p.checkFlag === 'Y'
          )
        : '',
      alarmEnterpriseList: this.activityDetailObj.listAlarmEnterprise
        ? this.activityDetailObj.listAlarmEnterprise.filter(
            (p) => p.checkFlag === 'Y'
          )
        : '',
      serviceEnterpriseList: this.activityDetailObj.serviceEDS
        ? this.activityDetailObj.serviceEDS.filter((p) => p.checkFlag === 'Y')
        : '',
      serviceFixedBroadbandList: this.activityDetailObj.serviceFBB
        ? this.activityDetailObj.serviceFBB.filter((p) => p.checkFlag === 'Y')
        : '',
      alarmSiteCodeNote: this.activityDetailObj.alarmSiteCodeNote,
      alarmServiceNote: this.activityDetailObj.alarmServiceNote,
      alarmEnterpriseNote: this.activityDetailObj.alarmEnterpriseNote,
      serviceEnterpriseNote: this.activityDetailObj.serviceEnterpriseNote,
      serviceFbbNote: this.activityDetailObj.serviceFbbNote,
      checkSiteCode: this.checkSiteCode,
      checkService: this.checkService,
      checkEnterprise: this.checkEnterprise,
      haveServiceEds: this.dataMaster.controlDetail.haveServiceEds,
      haveServiceFbb: this.dataMaster.controlDetail.haveServiceFbb,
      alarmStatusBefore: this.dataMaster.controlDetail.alarmStatusBefore,
	    edsStatusBefore: this.dataMaster.controlDetail.edsStatusBefore,
	    fbbStatusBefore: this.dataMaster.controlDetail.fbbStatusBefore,
      deleteAttachFileIdList: this.deleteAttachFileList
    };
    console.log('saveActivityDetail >', dataObj);

    this.smartControlService.saveActivityDetail(dataObj).takeWhile((alive) => true).subscribe(
      async (data) => {
        const result = data;
        if (result && result.resultCode === '0') {
          this.deleteAttachFileList = [];
          let input = new FormData();

          console.log('upload file data : this.fileUploadSuccessList',this.fileUploadSuccessList);
          if(this.fileUploadSuccessList && this.fileUploadSuccessList.length > 0){
            for  (var i =  0; i <  this.fileUploadSuccessList.length; i++)  {  
              input.append("file[]",  this.fileUploadSuccessList[i]);
            } 
            // input.append("file", this.fileUploadSuccessList);
            // if (this.refId) {
              input.append("attach_wrId", this.wrId);
            // } else {
              input.append("attach_userId", dataObj.userId);
            // }
            console.log(' uploadFileWr input : ',input);
            this.fileManagement.uploadFileWr(input).takeWhile((alive) => true).subscribe(
              async (dataUploadFile) => {
                this.sendMessage('reload_dashboard', this.receiver);
                // this.clearData();
                this.onRefresh((newItem) =>{
                  // console.log('..........onRefresh newItem : ',newItem);
                  if(this.listWRStatusCanSendSMSCancelFlow.includes(dataObj.wrStatus)){
                    this.tabIndex = '3'
                    // console.log('..........onRefresh this.tabIndex : ',this.tabIndex);
                    this.activityDetailObj.serviceFBB.forEach(row => {
                      row.selected = true;
                    });
                  }
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'WR document has been saved.',
                  });
                  return true;
                });

                this.fileUploadSuccessList = [];
                console.log('upload file data : this.fileUploadSuccessList',this.fileUploadSuccessList);
                const resultUploadFile = dataUploadFile;
                if (resultUploadFile && resultUploadFile.resultCode === '0') {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Upload file completed.',
                  });
                }else{
                  this.confirmationService.confirm({
                    message: result.resultMessage,
                    rejectLabel: 'Close',
                    rejectButtonStyleClass: 'p-button-warning',
                    key: 'errorDialog',
                    acceptVisible: false,
                  });
                }
              },(error) => {
                this.confirmationService.confirm({
                  message: error.message,
                  rejectLabel: 'Close',
                  rejectButtonStyleClass: 'p-button-warning',
                  key: 'errorDialog',
                  acceptVisible: false,
                });
                this.loading = false;
              }
            );
          }else{
            this.sendMessage('reload_dashboard', this.receiver);
            // this.clearData();
            this.onRefresh((newItem) =>{
              // console.log('..........onRefresh newItem : ',newItem);
              if(this.listWRStatusCanSendSMSCancelFlow.includes(dataObj.wrStatus)){
                this.tabIndex = '3'
                // console.log('..........onRefresh this.tabIndex : ',this.tabIndex);
                this.activityDetailObj.serviceFBB.forEach(row => {
                  row.selected = true;
                });
              }
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'WR document has been saved.',
              });
              return true;
            });
          }

        
          // this.fetchDataAfterSave();
        } else {
          this.loading = false;
          this.confirmationService.confirm({
            message: result.resultMessage,
            rejectLabel: 'Close',
            rejectButtonStyleClass: 'p-button-warning',
            key: 'errorDialog',
            acceptVisible: false,
          });
        }
      },
      (error) => {
        this.confirmationService.confirm({
          message: error.message,
          rejectLabel: 'Close',
          rejectButtonStyleClass: 'p-button-warning',
          key: 'errorDialog',
          acceptVisible: false,
        });
        this.loading = false;
      }
    );
  }

  fetchDataAfterSave() {
    this.getActivityDetail();
    this.getActivityService();
  }

  getActivityService(): void {
    this.loading = true;
    this.smartControlService
      .getActivityService(this.wrId, this.userProfile.name)
      .takeWhile((alive) => true)
      .subscribe(
        async (data) => {
          const result = data;
          if (result && result.resultCode === '0') {
            if (result.resultData) {
              this.activityDetailObj.listAlarmSiteCode =
                result.resultData.alarmSite;
              this.activityDetailObj.listAlarmService =
                result.resultData.alarmService;
              this.activityDetailObj.listAlarmEnterprise =
                result.resultData.alarmEDS;
              this.activityDetailObj.serviceEDS = result.resultData.serviceEDS;
              this.activityDetailObj.serviceFBB = result.resultData.serviceFBB;
              this.activityDetailObj.limitEDS = result.resultData.limitEDS;
              this.activityDetailObj.countServiceL3 = result.resultData.countServiceL3;
              this.activityDetailObj.alarmLastCheck = result.resultData.alarmLastCheck;
              this.activityDetailObj.serviceLastCheck = result.resultData.serviceLastCheck;
              // console.log('================>>>>======================= getActivityService : ',this.activityDetailObj.serviceFBB);
              this.reload = this.activityDetailObj.serviceFBB
            }
            this.loading = false;
          }
        },
        (error) => {
          this.confirmationService.confirm({
            message: error.message,
            rejectLabel: 'Close',
            rejectButtonStyleClass: 'p-button-warning',
            key: 'errorDialog',
            acceptVisible: false,
          });
          this.loading = false;
        }
      );
  }

  async activityCheckFBB(param) {
    this.loading = true;
    for (let i = 0; i < param.length; i++) {
      let obj = {
        accessNode: param[i].accessNode,
        pon: param[i].pon,
        splitterName: param[i].splitterFullname,
        wrId: this.wrId,
        wrStatus: this.wrStatus,
      };
      this.smartControlService
        .checkActivityDetailFBB(obj)
        .takeWhile((alive) => true)
        .subscribe(
          async (data1) => {
            const result = data1;
            if (result) {
              if (result.resultCode === '0') {
                // param[i].totalCount = result.resultData.countAll;
                param[i].checkFlag = 'Y';
                if (this.wrStatus == 'CONFIRM') {
                  param[i].onlineCount = result.resultData.countOnlineBF;
                  param[i].chkBfCount = result.resultData.countOnlineBF;
                } else {
                  param[i].onlineCount = result.resultData.countOnlineAF;
                  param[i].chkAtCount = result.resultData.countOnlineAF;
                }

                for (
                  let j = 0;
                  j < this.activityDetailObj.serviceFBB.length;
                  j++
                ) {
                  if (param[i].id == this.activityDetailObj.serviceFBB[j].id) {
                    this.activityDetailObj.serviceFBB[j] = param[i];
                    break;
                  }
                }
              } else {
                param[i].chkBfCount = result.resultData.resultMessage;
                param[i].chkAtCount = result.resultData.resultMessage;
              }
            }
            if(i === param.length - 1) {
              this.messageService.add({
                severity: 'success',
                summary: 'success',
                detail: '',
              });
              this.loading = false;
            }
          },
          (error) => {
            this.confirmationService.confirm({
              message: 'activityCheckFBB : ' + error.message,
              header: 'Error',
              icon: 'pi pi-exclamation-triangle',
              rejectLabel: 'Close',
              rejectButtonStyleClass: 'p-button-warning',
              key: 'warningDialog',
              acceptVisible: false,
            });
            this.loading = false;
          }
        );
    }
  }

  activityCheckAlarmSiteCode(param, checkAll, index) {
    this.loading = true;

    let scList = [];
    let serverList = [];
    let bfFlagList = [];

    for (let i = 0; i < param.length; i++) {
      scList.push(param[i].siteCode);
      serverList.push(param[i].serverSerial);
      bfFlagList.push(
        typeof param[i].chkBfFlag === 'undefined' ? '' : param[i].chkBfFlag
      );
    }

    let obj = {
      wrId: this.wrId,
      wrStatus: this.wrStatus,
      siteCodeList: scList,
      serverSerialList: serverList,
      chkBfFlagList: bfFlagList,
      checkAll: checkAll,
    };
    this.smartControlService
      .checkActivityDetailAlarmSiteCode(obj)
      .takeWhile((alive) => true)
      .subscribe(
        async (data2) => {
          this.checkSiteCode = 'Y';
          let objList = data2.resultData;
          if (data2.resultCode === '0') {
            for (let i = 0; i < objList.length; i++) {
              if (i > param.length - 1) {
                // push new alarm
                let obj = objList[i];
                obj.checkFlag = 'Y';
                obj.alarmType = 'Site Code';
                param.push(obj);
              } else {
                if (param[i].serverSerial == objList[i].serverSerial) {
                  param[i].chkBfFlag = objList[i].chkBfFlag;
                  param[i].chkAtFlag = objList[i].chkAtFlag;
                  param[i].checkFlag = 'Y';
                  if (this.wrStatus == 'CONFIRM') {
                    param[i].foundAlarm = objList[i].chkBfFlag;
                  } else {
                    param[i].foundAlarm = objList[i].chkAtFlag;
                  }
                }
              }
              if (!checkAll) {
                this.activityDetailObj.listAlarmSiteCode[index] = param[i];
              }
            }
            // Loop for save check all,support new alarm
            if (checkAll) {
              for (let k = 0; k < param.length; k++) {
                for (
                  let j = 0;
                  j < this.activityDetailObj.listAlarmSiteCode.length;
                  j++
                ) {
                  if (
                    param[k].serverSerial ==
                    this.activityDetailObj.listAlarmSiteCode[j].serverSerial
                  ) {
                    this.activityDetailObj.listAlarmSiteCode[j] = param[k];
                    break;
                  }
                }
                if (k > this.activityDetailObj.listAlarmSiteCode.length - 1) {
                  // push new alarm
                  let obj = param[k];
                  obj.checkFlag = 'Y';
                  this.activityDetailObj.listAlarmSiteCode.push(obj);
                }
              }
            }
          } else {
            this.confirmationService.confirm({
              message: data2.resultMessage,
              header: 'Error',
              icon: 'pi pi-exclamation-triangle',
              rejectLabel: 'Close',
              rejectButtonStyleClass: 'p-button-warning',
              key: 'warningDialog',
              acceptVisible: false,
            });
          }
          this.messageService.add({
            severity: 'success',
            summary: 'success',
            detail: '',
          });
          this.loading = false;
        },
        (error) => {
          this.confirmationService.confirm({
            message: 'activityCheckAlarmSiteCode : ' + error.message,
            header: 'Error',
            icon: 'pi pi-exclamation-triangle',
            rejectLabel: 'Close',
            rejectButtonStyleClass: 'p-button-warning',
            key: 'warningDialog',
            acceptVisible: false,
          });
          this.loading = false;
        }
      );
  }

  activityCheckAlarmService(param, checkAll, index) {
    this.loading = true;

    let scList = [];
    let serverList = [];
    let bfFlagList = [];

    for (let i = 0; i < param.length; i++) {
      scList.push(param[i].nonMobile);
      serverList.push(param[i].serverSerial);
      bfFlagList.push(
        typeof param[i].chkBfFlag === 'undefined' ? '' : param[i].chkBfFlag
      );
    }

    let obj = {
      wrId: this.wrId,
      wrStatus: this.wrStatus,
      serviceList: scList,
      serverSerialList: serverList,
      chkBfFlagList: bfFlagList,
      checkAll: checkAll,
    };
    this.smartControlService
      .checkActivityDetailAlarmService(obj)
      .takeWhile((alive) => true)
      .subscribe(
        async (data2) => {
          this.checkService = 'Y';
          let objList = data2.resultData;
          if (data2.resultCode === '0') {
            for (let i = 0; i < objList.length; i++) {
              if (i > param.length - 1) {
                // push new alarm
                let obj = objList[i];
                obj.checkFlag = 'Y';
                obj.alarmType = 'Service';
                param.push(obj);
              } else {
                if (param[i].serverSerial == objList[i].serverSerial) {
                  param[i].chkBfFlag = objList[i].chkBfFlag;
                  param[i].chkAtFlag = objList[i].chkAtFlag;
                  param[i].checkFlag = 'Y';
                  if (this.wrStatus == 'CONFIRM') {
                    param[i].foundAlarm = objList[i].chkBfFlag;
                  } else {
                    param[i].foundAlarm = objList[i].chkAtFlag;
                  }
                }
              }
              if (!checkAll) {
                this.activityDetailObj.listAlarmService[index] = param[i];
              }
            }
            // Loop for save check all,support new alarm
            if (checkAll) {
              for (let k = 0; k < param.length; k++) {
                for (
                  let j = 0;
                  j < this.activityDetailObj.listAlarmService.length;
                  j++
                ) {
                  if (
                    param[k].serverSerial ==
                    this.activityDetailObj.listAlarmService[j].serverSerial
                  ) {
                    this.activityDetailObj.listAlarmService[j] = param[k];
                    break;
                  }
                }
                if (k > this.activityDetailObj.listAlarmService.length - 1) {
                  // push new alarm
                  let obj = param[k];
                  obj.checkFlag = 'Y';
                  this.activityDetailObj.listAlarmService.push(obj);
                }
              }
            }
          } else {
            this.confirmationService.confirm({
              message: data2.resultMessage,
              header: 'Error',
              icon: 'pi pi-exclamation-triangle',
              rejectLabel: 'Close',
              rejectButtonStyleClass: 'p-button-warning',
              key: 'warningDialog',
              acceptVisible: false,
            });
          }
          this.messageService.add({
            severity: 'success',
            summary: 'success',
            detail: '',
          });
          this.loading = false;
        },
        (error) => {
          this.confirmationService.confirm({
            message: 'activityCheckAlarmService : ' + error.message,
            header: 'Error',
            icon: 'pi pi-exclamation-triangle',
            rejectLabel: 'Close',
            rejectButtonStyleClass: 'p-button-warning',
            key: 'warningDialog',
            acceptVisible: false,
          });
          this.loading = false;
        }
      );
  }

  activityCheckAlarmEnterprise(param, checkAll, index) {
    this.loading = true;
    let nomobileList = [];
    let serverList = [];
    let bfFlagList = [];

    for (let i = 0; i < param.length; i++) {
      nomobileList.push(param[i].nonMobile);
      serverList.push(param[i].serverSerial);
      bfFlagList.push(
        typeof param[i].chkBfFlag === 'undefined' ? '' : param[i].chkBfFlag
      );
    }

    let obj = {
      wrId: this.wrId,
      wrStatus: this.wrStatus,
      serverSerialList: serverList,
      chkBfFlagList: bfFlagList,
      enterpriseList: nomobileList,
      checkAll: checkAll,
    };
    this.smartControlService
      .checkActivityDetailAlarmEnterprise(obj)
      .takeWhile((alive) => true)
      .subscribe(
        async (data2) => {
          this.checkEnterprise = 'Y';
          let objList = data2.resultData;
          if (data2.resultCode === '0') {
            for (let i = 0; i < objList.length; i++) {
              if (i > param.length - 1) {
                // push new alarm
                let obj = objList[i];
                obj.checkFlag = 'Y';
                obj.alarmType = 'Enterprise';
                param.push(obj);
              } else {
                if (param[i].serverSerial == objList[i].serverSerial) {
                  param[i].chkBfFlag = objList[i].chkBfFlag;
                  param[i].chkAtFlag = objList[i].chkAtFlag;
                  param[i].checkFlag = 'Y';
                  if (this.wrStatus == 'CONFIRM') {
                    param[i].foundAlarm = objList[i].chkBfFlag;
                  } else {
                    param[i].foundAlarm = objList[i].chkAtFlag;
                  }
                }
              }
              if (!checkAll) {
                this.activityDetailObj.listAlarmEnterprise[index] = param[i];
              }
            }

            // Loop for save check all,support new alarm
            if (checkAll) {
              for (let k = 0; k < param.length; k++) {
                for (
                  let j = 0;
                  j < this.activityDetailObj.listAlarmEnterprise.length;
                  j++
                ) {
                  if (
                    param[k].serverSerial ==
                    this.activityDetailObj.listAlarmEnterprise[j].serverSerial
                  ) {
                    this.activityDetailObj.listAlarmEnterprise[j] = param[k];
                    break;
                  }
                }
                if (k > this.activityDetailObj.listAlarmEnterprise.length - 1) {
                  // push new alarm
                  let obj = param[k];
                  obj.checkFlag = 'Y';
                  this.activityDetailObj.listAlarmEnterprise.push(obj);
                }
              }
            }
            
          } else {
            this.confirmationService.confirm({
              message: data2.resultMessage,
              header: 'Error',
              icon: 'pi pi-exclamation-triangle',
              rejectLabel: 'Close',
              rejectButtonStyleClass: 'p-button-warning',
              key: 'warningDialog',
              acceptVisible: false,
            });
          }
          this.messageService.add({
            severity: 'success',
            summary: 'success',
            detail: '',
          });
          this.loading = false;
        },
        (error) => {
          this.confirmationService.confirm({
            message: 'activityCheckAlarmEnterprise : ' + error.message,
            header: 'Error',
            icon: 'pi pi-exclamation-triangle',
            rejectLabel: 'Close',
            rejectButtonStyleClass: 'p-button-warning',
            key: 'warningDialog',
            acceptVisible: false,
          });
          this.loading = false;
        }
      );
  }

  onCallBackActionAutoCheck(param) {
    if (param.actionCallBack == 'onDatePickerReturn') {
      this.onDatePickerReturn(param);
    }
  }

  onDatePickerReturn(data) {
    if (data.paramId === 'autoAlarmDate') {
      this.activityDetailObj.alarmCheckingDate = data.data;
    } else if (data.paramId === 'autoServiceDate') {
      this.activityDetailObj.serviceCheckingDate = data.data;
    }
  }

  activityCheckEnterprise(param) {
    this.loading = true;
    var enterpriseList = [];

    for (var i = 0; i < param.length; i++) {
      let serviceType = param[i].serviceType;
      if(serviceType){
        serviceType = serviceType.toUpperCase();
        if (serviceType.startsWith('L3')) {
          enterpriseList.push(param[i].nonMobile);
        }
      }
    }

    let obj = {
      userName: this.userProfile.name,
      userId: this.userProfile.id ? this.userProfile.id : this.userProfile.pid,
      enterpriseList: enterpriseList,
      wrId: this.wrId,
      wrStatus: this.wrStatus,
    };
    this.smartControlService
      .checkActivityDetailEnterprise(obj)
      .takeWhile((alive) => true)
      .subscribe(
        async (data1) => {
          const result = data1;
          if (result) {
            if (result.resultCode === '0') {
              for (var i = 0; i < param.length; i++) {
                for (var j = 0; j < result.resultData.length; j++) {
                  param[i].refId = param[i].id;
                  if (param[i].nonMobile === result.resultData[j].nonMobile) {
                    param[i].checkFlag = 'Y';
                    if (this.wrStatus == 'CONFIRM') {
                      param[i].chkBfFlag = result.resultData[j].chkBfFlag;
                      param[i].checkResult = result.resultData[j].chkBfResult;
                      break;
                    } else {
                      param[i].chkAtFlag = result.resultData[j].chkAtFlag;
                      param[i].checkResult = result.resultData[j].chkAtResult;
                      break;
                    }
                  }
                }
              }
            } else {
              this.confirmationService.confirm({
                message: result.resultMessage,
                header: 'Error',
                icon: 'pi pi-exclamation-triangle',
                rejectLabel: 'Close',
                rejectButtonStyleClass: 'p-button-warning',
                key: 'warningDialog',
                acceptVisible: false,
              });
            }
          }
          this.messageService.add({
            severity: 'success',
            summary: 'success',
            detail: '',
          });
          this.loading = false;
        },
        (error) => {
          this.confirmationService.confirm({
            message: 'activityCheckEnterprise : ' + error.message,
            header: 'Error',
            icon: 'pi pi-exclamation-triangle',
            rejectLabel: 'Close',
            rejectButtonStyleClass: 'p-button-warning',
            key: 'warningDialog',
            acceptVisible: false,
          });
          this.loading = false;
        }
      );
  }

  onGenDatetimeMode() {
    let mode = 'datePickerMode';
    if (
      this.dataMaster.controlDetail &&
      this.dataMaster.controlDetail.canSaveActivity === 'N'
    ) {
      mode = 'VIEW';
    }

    return mode;
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

  async sendMessage(clientMessage: string, receiver: any) {
    this.isSendingMessage = await this.socketService.sendMessage(
      clientMessage,
      true,
      this.sender,
      receiver
    );
  }

  activityCheckAllAlarm() {
    this.loading = true;
    let dataObj = {
      userName: this.userProfile.name,
      userId: this.userProfile.id ? this.userProfile.id : this.userProfile.pid,
      wrId: this.wrId,
      wrStatus: this.wrStatus,
      action: 'ALM',
    };
    this.smartControlService
      .saveWRActivityALM(dataObj)
      .takeWhile((alive) => true)
      .subscribe(
        async (data) => {
          const result = data;
          if (result && result.resultCode === '0') {
            this.getActivityService();
            this.messageService.add({
              severity: 'success',
              summary: 'success',
              detail: '',
            });
            this.sendMessage('reload_dashboard', this.receiver);
            this.loading = false;
          }
        },
        (error) => {
          this.confirmationService.confirm({
            message: error.message,
            rejectLabel: 'Close',
            rejectButtonStyleClass: 'p-button-warning',
            key: 'errorDialog',
            acceptVisible: false,
          });
          this.loading = false;
        }
      );
  }

  canSentSMSFbb(item){
    // console.log('activity detail canSentSMSFbb : ',item.statusId);
   
    if(this.listWRStatusCanSendSMSCompleteFlow.includes(item.statusId)){
      this.smsType = 'COMPLETE';
    }else if (this.listWRStatusCanSendSMSCancelFlow.includes(item.statusId) ){
      this.smsType = 'CANCEL';
    }else{
      this.smsType = 'NONE';
    }
    return this.smsType;
  }

  async sendSmsFBBById(){
    this.loading = true;

    let checkFBBIdList = this.activityDetailObj.serviceFBB.filter(obj => obj.selected).map(opt => opt.id);
    // console.log('sendSmsFBBById checkFBBIdList : ',checkFBBIdList,checkFBBIdList.length, this.activityDetailObj.serviceFBB.length);
    // console.log('sendSmsFBBById this.activityDetailObj.serviceFBB : ',this.activityDetailObj.serviceFBB);

    if(checkFBBIdList.length == this.activityDetailObj.serviceFBB.length){
      checkFBBIdList = null;
    }

    await this.smartControlService.sendSmsFBBById(
        this.userProfile.name,
        this.userProfile.id ? this.userProfile.id : this.userProfile.pid,
        this.wrId,
        this.ainId,
        checkFBBIdList,
        this.smsType
      ).takeWhile((alive) => true).subscribe(async (data) => {
          const result = data;
          if (result && result.resultCode === '0') {
            // console.log('.......... sendSmsFBBById result : ',result);
            // this.reload = !this.reload;
            
            this.sendMessage('reload_dashboard', this.receiver);
            
            this.onRefresh((newItem) =>{
              // console.log('..........onRefresh newItem : ',newItem);
              this.messageService.add({
                severity: 'success',
                summary: 'Success.',
                detail: '',
              });
              return true;
            });
           
            
          } else {
            this.confirmationService.confirm({
              message: result.resultMessage,
              rejectLabel: 'Close',
              rejectButtonStyleClass: 'p-button-warning',
              key: 'errorDialog',
              acceptVisible: false,
            });
          }
          this.loading = false;
        },
        (error) => {
          this.confirmationService.confirm({
            message: error,
            header: 'Error',
            icon: 'pi pi-exclamation-triangle',
            rejectLabel: 'Close',
            acceptVisible: false,
          });
          // this.filter = {};
          // this.getDashboard((newItem) =>{
              
          // });
        }
    );
  }

  async onRefresh(callback){
    await this.clearData();
    await this.onListStatusActForKeyIn();
    await this.getActivityDetail();
    await this.getActivityService();

    setTimeout(() => {
      // console.log("this is task 3");
      return callback(this.activityDetailObj.serviceFBB);
    // })
    },  1000)
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    // console.log('tabChangeEvent => ', tabChangeEvent);
    // console.log('index => ', tabChangeEvent.index);
    this.tabIndex = tabChangeEvent.index.toString();
  }

  myUploader(event){
    console.log(' myUploader : ',event);
  }
}
