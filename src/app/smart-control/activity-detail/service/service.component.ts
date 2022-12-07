import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss'],
})
export class ServiceComponent implements OnInit {
  @Input() activityDetailObj: any;
  @Input() dataMaster: any;
  @Output() onCallBackAction = new EventEmitter();

  dataTableEnterpriseValue: any = {
    rowList: new Array(),
    // columnList: this.columnList
  };

  dataTableFBBValue: any = {
    rowList: new Array(),
    // columnList: this.columnList
  };

  constructor() {}

  ngOnInit() {}

  callBackAction(data, actionCallBack) {
    //console.log('index : '+index);

    // data.index = index;
    let param = { data: data, actionCallBack: actionCallBack };
    this.onCallBackAction.emit(param);
  }

  onTblCallBackAction(data) {
    // console.log('onTblCallBackAction data : '+data);
  }
}
