import { CommonService } from './../../../services/common.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-title-modal',
  templateUrl: './title-modal.component.html',
  styleUrls: ['./title-modal.component.scss'],
})
export class TitleModalComponent implements OnInit {
  loading: boolean = false;
  titleSelected: any;
  sourceData: any = [];
  targetData: any = [];
  @Input() TitleModal: boolean = false;
  @Output() selectedEmitter = new EventEmitter<any>();
  @Output() closeEmitter = new EventEmitter<any>();

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {}

  onOpenModal() {
    this.TitleModal = true;
    this.findJobTitle();
  }

  findJobTitle() {
    this.loading = true;
    this.commonService
      .findJobTitle()
      .toPromise()
      .then((res: any) => {
        this.sourceData = res.resultData.RESULT.JOBTITLE;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  onSelectTitle() {
    this.selectedEmitter.emit(this.titleSelected);
    this.TitleModal = false;
  }

  onCloseModal() {
    this.TitleModal = false;
    this.closeEmitter.emit();
  }
}
