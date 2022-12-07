import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Columns } from 'app/shared-components/data-table2/models/columns';
import { TimelineItem } from '../../shares/component/timeline-horizontal/timeline-item';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FileAttachActm } from 'app/models/file-attach-actm.model';
import { Chips } from 'primeng-lts/chips';
import { ConfirmationService } from 'primeng-lts/api';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit, OnChanges {
  @Input() activityDetailObj: any;
  @Input() dataMaster: any;
  @Input() nocDataTable: any;
  @Input() nocList: any;
  @Input() loading: boolean;
  @Input() uploadedFiles:  any[];
  @Output() onCallBackAction = new EventEmitter();
  @ViewChild(Chips) ms: Chips;

  autoAlarmChecking: boolean;
  datePickerType: string = 'DATE_TIME';
  datePickerMode: string = 'EDIT';

  listNocDDL: Array<any>;
  nocDDLSettings: {};

  nocSelectList: Array<any>;
  nocSelect: Array<any>;

  items: TimelineItem[];

  columnList: Array<Columns> = [
    new Columns({
      headerName: 'Job',
      propertyName: 'jbId',
      isSortingDisplay: true,
      styleClass: 'left',
    }),
    new Columns({
      headerName: 'Name - SurName',
      propertyName: 'displayNameSurName',
      isSortingDisplay: true,
      styleClass: 'left',
    }),
    new Columns({
      headerName: 'Mobile',
      propertyName: 'mobileNo',
      isSortingDisplay: true,
      styleClass: 'left',
    }),
    new Columns({
      headerName: 'Team',
      propertyName: 'dept',
      isSortingDisplay: true,
      styleClass: 'center',
    }),
  ];
  workerDataTableValue: any = {
    rowList: [],
    pageSizeList: [10000],
  };

  nocColumnList: Array<Columns> = [
    new Columns({
      headerName: 'NOC Name',
      propertyName: 'nocName',
      isSortingDisplay: false,
      styleClass: 'left',
    }),
    new Columns({
      headerName: 'Team',
      propertyName: 'nocTeam',
      isSortingDisplay: true,
      styleClass: 'center',
    }),
    new Columns({
      headerName: 'Tel.',
      propertyName: 'nocTel',
      isSortingDisplay: true,
      styleClass: 'left',
    }),
    new Columns({
      headerName: 'Email',
      propertyName: 'nocEmail',
      isSortingDisplay: true,
      styleClass: 'left',
    }),
  ];
  nocDataTableValue: any = {
    rowList: [],
    columnList: this.nocColumnList,
  };

  values3: Array<any>;
  // uploadedFiles: FileAttachActm[] = [];

  public form: FormGroup;
  selectedNoc: any;
  constructor(
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
  ) {
    //   this.form = new FormGroup({
    //     selectedNoc: new FormControl()
    //  });
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('detail component ngOnChange : ',this.uploadedFiles);
    if (changes.dataMaster) {
      console.log('dataMaster ======>');
      this.setDataMaster();
    }

    if (changes.activityDetailObj) {
      console.log('detail component activityDetailObj ======>');
      this.setActivityDetailObj();
    }

  }

  ngOnInit() {
    console.log(' detail component ngOnInit : ',this.uploadedFiles);
    this.setActivityDetailObj();
    this.setDataMaster();
  }

  setActivityDetailObj() {
    if (this.activityDetailObj) {
      this.autoAlarmChecking = this.activityDetailObj.autoAlarmChecking;
    }
  }

  setDataMaster() {
    if (this.dataMaster) {
      this.workerDataTableValue = {};
      this.workerDataTableValue.rowList = this.dataMaster.workerList;
      this.workerDataTableValue.pageSizeList = [10000];
      this.items = this.dataMaster.activityHistory;
      this.listNocDDL = this.dataMaster.mstNocList;
      if (this.dataMaster.nocList) {
        this.nocSelectList = this.dataMaster.nocList;

        this.selectedNoc = this.nocSelectList;
        let param = { data: this.nocSelectList, actionCallBack: 'noc' };
        this.onCallBackAction.emit(param);
      }
    }
  }

  ngDoCheck(): void {
    //Called every time that the input properties of a component or a directive are checked. Use it to extend change detection by performing a custom check.
    //Add 'implements DoCheck' to the class.
    //table wirker
    if (this.dataMaster.workerList && !this.workerDataTableValue.rowList) {
      this.workerDataTableValue.rowList = this.dataMaster.workerList;
    }

    //data history timeline
    if (this.dataMaster.activityHistory && !this.items) {
      this.items = this.dataMaster.activityHistory;
    }

    //inform NOC LIST
    if (this.dataMaster.mstNocList && !this.listNocDDL) {
      this.listNocDDL = this.dataMaster.mstNocList;
    }
    if (this.dataMaster.nocList && !this.selectedNoc) {
      this.nocSelectList = this.dataMaster.nocList;
      this.selectedNoc = this.dataMaster.nocList;
    }
  }

  public onDropDownChange(nocData: any) {
    let param = { data: nocData.value, actionCallBack: 'noc' };
    this.onCallBackAction.emit(param);
  }

  onClickNocInformation() {
    window.open(this.dataMaster.controlDetail.nocInformUrl, '_blank');
  }

  onDownloadDocument(event){
    console.log('==============onDownloadDocument===================',event);
    let param = { data: event.value, actionCallBack: 'onDownloadDocument' };
    this.onCallBackAction.emit(param);
  }

  onRemoveDocument(event){
    // this.confirmationService.confirm({
    //   message: 'ยืนยันการลบหรือไม่',
    //   header: 'Confirmation',
    //   accept: () => {
        // this.onRemoveDocument(args);
        let param = { data: event.value, actionCallBack: 'onDeleteDocument' };
        this.onCallBackAction.emit(param);
    //   },
    //   reject: () => {
    //     let param = { data: event.value, actionCallBack: 'onRefresh' };
    //     this.onCallBackAction.emit(param);
    //     return;
    //   }
    // });
    console.log('==============onRemoveDocument===================',event,this.uploadedFiles);
  }

  // attachFile
  openAttachFileDialog() {
    let param = { data: this.uploadedFiles, actionCallBack: 'onOpenAttachFileDialog' };
    this.onCallBackAction.emit(param);
  }
}
