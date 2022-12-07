import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { SmartControlDataService } from 'app/services/smart-control-data.service';
declare let $;
@Component({
  selector: 'app-noti-tab',
  templateUrl: './noti-tab.component.html',
  styleUrls: ['./noti-tab.component.scss', '../../../../assets/css/asc.css'],
})
export class NotiTabComponent implements OnInit {
  @Input() dataNoti: any;
  @Output() onCallBackAction = new EventEmitter();
  notiObjList: any = [];

  constructor(
    private dataService: SmartControlDataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.setItem(15);
  }

  setItem(total) {
    total = parseInt(total);
    for (var i = 0; i < total; i++) this.notiObjList.push(i);
  }
  onClickNoti() {
    $('#notiTab').toggle('hideSidebar');
  }
  clickAction(data, actionCallBack) {
    let param = { data: data, actionCallBack: actionCallBack };
    this.onCallBackAction.emit(param);
  }

  onClickAllNoti(param) {
    this.router.navigate(['/asc/all-noti']);
  }

  gotoSubprojectDetail(data) {
    this.dataService.mode = 'EDIT';
    let obj = JSON.parse(data);
    this.dataService.gotoNextPage('/subcontract/subproject-detail', {
      arnSubProjectId: obj.arnSubProjectId,
      vendorCompanyCode: obj.vendorCompanyCode,
      backbtn: 'N',
    });
  }

  gotoVerifyRolloutDetail(data) {
    this.dataService.mode = 'EDIT';
    let obj = JSON.parse(data);
    this.dataService.gotoNextPage('/subcontract/rollout-detail', {
      rolloutId: obj.rolloutId,
      systemServiceId: obj.systemServiceId,
      backbtn: 'N',
    });
  }
}
