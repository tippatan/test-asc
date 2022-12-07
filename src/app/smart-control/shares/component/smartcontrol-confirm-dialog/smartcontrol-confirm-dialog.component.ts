import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-smartcontrol-confirm-dialog',
  templateUrl: './smartcontrol-confirm-dialog.component.html',
  styleUrls: ['./smartcontrol-confirm-dialog.component.scss'],
})
export class SmartcontrolConfirmDialogComponent implements OnInit {
  title: string = 'Confirmation';
  type: string = 'confirm';
  message: string = '';
  commentShow: string = 'hide'; /* show/hide */
  commentTitle: string = '';
  commentResult: string = '';
  btnConfirmName: string = 'Draft';
  btnConfirmShow: string = 'show'; /* show/hide */
  btnRejectName: string = 'Reject';
  btnRejectShow: string = 'hide'; /* show/hide */
  btnCancelName: string = 'Close';
  btnCancelShow: string = 'show'; /* show/hide */
  requireComment: boolean = false;

  isDisabledConfirmBtn: boolean = true;

  dialog: MatDialogRef<SmartcontrolConfirmDialogComponent>;

  constructor(
    private dialogRef: MatDialogRef<SmartcontrolConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data
  ) {}

  ngOnInit() {
    this.dialog = this.dialogRef;
    if (this.data) {
      this.title = this.data.title ? this.data.title : this.title;
      this.type = this.data.type ? this.data.type : this.type;
      this.message = this.data.message;
      this.commentTitle = this.data.commentTitle
        ? this.data.commentTitle
        : this.commentTitle;
      this.commentResult = this.data.commentResult
        ? this.data.commentResult
        : this.commentResult;

      this.btnConfirmName = this.data.btnConfirmName
        ? this.data.btnConfirmName
        : this.btnConfirmName;
      this.btnConfirmShow =
        this.data.btnConfirmShow === 'hide'
          ? this.data.btnConfirmShow
          : this.btnConfirmShow;
      this.btnRejectName = this.data.btnRejectName
        ? this.data.btnRejectName
        : this.btnRejectName;
      this.btnRejectShow =
        this.data.btnRejectShow === 'show'
          ? this.data.btnRejectShow
          : this.btnRejectShow;
      this.btnCancelName = this.data.btnCancelName
        ? this.data.btnCancelName
        : this.btnCancelName;
      this.btnCancelShow =
        this.data.btnCancelShow === 'hide'
          ? this.data.btnCancelShow
          : this.btnCancelShow;
      this.commentShow =
        this.data.commentShow === 'show'
          ? this.data.commentShow
          : this.commentShow;
      this.requireComment = this.data.requireComment
        ? this.data.requireComment
        : false;
    }
  }

  onConfirm() {
    let result: any = {};
    result.isConfirm = true;
    result.commentResult = this.commentResult;
    // console.log('data',result);

    this.dialogRef.close(result);
  }

  onReject() {
    let result: any = {};
    result.isReject = true;
    result.commentResult = this.commentResult;

    this.dialogRef.close(result);
  }

  onClose() {
    this.dialogRef.close();
  }
}
