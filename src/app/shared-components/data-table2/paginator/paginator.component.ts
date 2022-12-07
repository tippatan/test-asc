import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import 'rxjs/add/operator/takeWhile';

import { PaginatorService } from '../services/paginator.service';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css'],
})
export class PaginatorComponent implements OnInit, OnDestroy {
  _controlId;
  _exportCriteria;
  @Input() pageSizeList;
  @Input() total;
  @Input() totalDisplay;
  @Input() tableExportHidden: boolean;
  @Input() pagingControlId;
  @Input() exportCriteria;
  @Output() onSelectedPageSize = new EventEmitter();
  @Output() onPageChangeEvent = new EventEmitter();
  @Output() onExportExcel = new EventEmitter();
  pagingForm: FormGroup;

  private alive = true;

  constructor(
    private formBuilder: FormBuilder,
    private paginatorService: PaginatorService
  ) {}

  ngOnInit() {
    this.createForm();
  }

  onPageChange($event) {
    this.onPageChangeEvent.emit($event);
  }

  onExportExcelEvent($event) {
    this.onExportExcel.emit($event);
  }

  private createForm() {
    this.pagingForm = this.formBuilder.group({
      pageSizeMultiSelect: [this.pageSizeList[0], []],
    });
    this.pagingForm.valueChanges.subscribe((data) => {
      this.onValueChanged();
    });
    this.onPageSizeChange();
  }

  private onPageSizeChange() {
    this.paginatorService
      .subscribePageChange()
      .takeWhile((alive) => this.alive)
      .subscribe((data) => {
        const formControl = this.pagingForm.get('pageSizeMultiSelect');
        if (data !== formControl.value) {
          formControl.setValue(data);
        }
      });
  }

  private onValueChanged() {
    if (!this.pagingForm) {
      return;
    }
    const formControl = this.pagingForm.get('pageSizeMultiSelect');
    this.paginatorService.selectedPage = formControl.value;
    this.onSelectedPageSize.emit(formControl.value);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
