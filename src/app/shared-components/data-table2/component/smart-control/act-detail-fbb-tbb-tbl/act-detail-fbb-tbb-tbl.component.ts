import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-act-detail-fbb-tbb-tbl',
  templateUrl: './act-detail-fbb-tbb-tbl.component.html',
  styleUrls: ['./act-detail-fbb-tbb-tbl.component.scss']
})
export class ActDetailFbbTbbTblComponent implements OnInit {
  @Input() dataRows: any;
  @Input() isCheckAllFbb: boolean = false;
  @Input() isCheckFbb: boolean = false;
  @Output() onCallBackAction = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  callBackAction(data, actionCallBack) {
    let param = { data: data, actionCallBack: actionCallBack };
    this.onCallBackAction.emit(param);
  }
}
