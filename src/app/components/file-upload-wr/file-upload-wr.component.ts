import { FileManagementService } from 'app/services/file-management.service';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FileUpload } from 'primeng-lts/fileupload';
import * as FileSaver from 'file-saver';
import { BehaviorSubject } from 'rxjs';
import { MessageService } from 'primeng-lts/api';
import { FileAttachActm } from 'app/models/file-attach-actm.model';


@Component({
  selector: 'app-file-upload-wr',
  templateUrl: './file-upload-wr.component.html',
  styleUrls: ['./file-upload-wr.component.scss']
})
export class FileUploadWrComponent implements OnInit {
  @ViewChild('fileUploadComponent') fileUpload: FileUpload;
  @Input() url: string;
  @Input() mode: string = 'advanced';
  @Input() multiple: boolean = true;
  @Input() accept: string = '';
  @Input() maxFileSize: string = '5242880';
  @Input() uploadedFiles: any[] = [];
  @Input() docId: string;
  @Input() refId: string;
  @Input() selectedFiles: any[] = [];
  totalFileSize = 0;
  @Output() onUploadEmitter = new EventEmitter<any>();
  @Output() onSelectEmitter = new EventEmitter<any>();
  @Input() remarkscheduleloadplan: boolean = false;
  @Input() isDownloadable: boolean = false;
  @Output() onDeleteEmitter = new EventEmitter<any>();

  totalFileSize$ = new BehaviorSubject<number>(0);

  constructor(
    private sanitizer: DomSanitizer,
    private fileManagement: FileManagementService,
    private messageService: MessageService
  ) {}
  ngAfterViewInit(): void {
    // this.fileUpload.validate = (file: File) => {
    //   if (this.fileUpload.accept && !this.isFileTypeValid(file)) {
    //     this.fileUpload.msgs.push({
    //       severity: 'error',
    //       summary: this.fileUpload.invalidFileTypeMessageSummary.replace(
    //         '{0}',
    //         file.name
    //       ),
    //       detail: this.fileUpload.invalidFileTypeMessageDetail.replace(
    //         '{0}',
    //         this.accept
    //       ),
    //     });
    //     return false;
    //   }

    //   if (this.maxFileSize && file.size > this.fileUpload.maxFileSize) {
    //     this.fileUpload.msgs.push({
    //       severity: 'error',
    //       summary: this.fileUpload.invalidFileSizeMessageSummary.replace(
    //         '{0}',
    //         file.name
    //       ),
    //       detail: this.fileUpload.invalidFileSizeMessageDetail.replace(
    //         '{0}',
    //         this.fileUpload.formatSize(this.maxFileSize)
    //       ),
    //     });
    //     return false;
    //   }
    //   let fileName = file.name;
    //   const pattern = /^[a-zA-Z0-9._-\s()]*$/;
    //   let matches = fileName.match(pattern);
    //   if (!matches) {
    //     this.fileUpload.msgs.push({
    //       severity: 'error',
    //       summary: fileName,
    //       detail: 'File name must be English only',
    //     });
    //     return false;
    //   }
    //   console.log(this.totalFileSize);
    //   if (this.totalFileSize + file.size > 15728640) {
    //     this.fileUpload.msgs.push({
    //       severity: 'error',
    //       summary: fileName + '',
    //       detail:
    //         'total file size: ' +
    //         (this.totalFileSize + file.size) +
    //         'Byte. total Files size must not larger than 15 MB.(15728640 Byte) ',
    //     });
    //     return false;
    //   } else {
    //     this.totalFileSize += file.size;
    //   }
    //   return true;
    // };
  }

  isFileTypeValid(file: File): boolean {
    let acceptableTypes = this.accept.split(',').map((type) => type.trim());
    for (let type of acceptableTypes) {
      let acceptable = this.fileUpload.isWildcard(type)
        ? this.fileUpload.getTypeClass(file.type) ===
          this.fileUpload.getTypeClass(type)
        : file.type == type ||
          this.fileUpload.getFileExtension(file).toLowerCase() ===
            type.toLowerCase();

      if (acceptable) {
        return true;
      }
    }

    return false;
  }

  ngOnInit(): void {
    // console.log(this.uploadedFiles)
    if (this.uploadedFiles.length > 0) {
      this.totalFileSize = this.uploadedFiles.reduce(
        (previousValue, currentValue) => {
          // console.log('file upload ngOnInit previousValue, currentValue ',previousValue, currentValue);
          return previousValue + (currentValue.size || currentValue.fileSize)
        },
        0
      );
      this.totalFileSize$.next(this.totalFileSize)
      // console.log('file upload ngOnInit this.totalFileSize ',this.totalFileSize);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
  //  console.log('file upload ngOnChanges this.uploadedFiles ',this.uploadedFiles, changes);
   if (this.uploadedFiles.length > 0) {
    this.totalFileSize = this.uploadedFiles.reduce(
      (previousValue, currentValue) => {
        // console.log('file upload ngOnInit previousValue, currentValue ',previousValue, currentValue);
        return previousValue + (currentValue.size || currentValue.fileSize)
      },
      0
    );
    this.totalFileSize$.next(this.totalFileSize)
    // console.log('file upload ngOnInit this.totalFileSize ',this.totalFileSize);
  }
  }

  // upload to server
  myUploader(event, fileUploadComponent): void {
    if (event.files.length == 0) {
      return;
    }
    let files = { ...event.files };
    fileUploadComponent.clear();
    // let totalFileSize = 0;
    // totalFileSize = event.files.reduce(
    //   (previousValue, currentValue) => previousValue.size + currentValue.size,
    //   totalFileSize
    // );
    // if (totalFileSize >= 15728640) {
    //   this.fileUpload.msgs.push({
    //     severity: 'error',
    //     summary: '',
    //     detail:
    //       'Upload file error total files size must not larger than 15 MB.',
    //   });
    // } else {
    //   for (let fileIndex = 0; fileIndex < event.files.length; fileIndex++) {
    //     this.onUploadEmitter.emit(files[fileIndex]);
    //   }
    // }
    for (let fileIndex = 0; fileIndex < event.files.length; fileIndex++) {
      this.onUploadEmitter.emit(files[fileIndex]);
    }
  }

  downloadFile(data) {
    this.fileManagement.getFile(data.attach_id).subscribe((res: any) => {
      let filename = decodeURI(res.headers.get('Content-Disposition'));
      const FILENAME_INDEX = 1;
      filename = filename.split('|')[FILENAME_INDEX];
      FileSaver.saveAs(res.body, filename);
    });
  }

  // function clear file
  clear() {
    this.fileUpload.clear();
  }

  clearUploadedFiles(oldFile = null) {
    this.fileUpload.msgs = [];
    this.uploadedFiles = oldFile || [];
  }

  onSelect(event) {
    // console.log('==========onSelect : ',event, this.totalFileSize);
    this.selectedFiles = event.currentFiles;
    this.onSelectEmitter.emit(this.selectedFiles);
  }

  onRemove(event) {
    // console.log('==========onRemove : ',event, this.totalFileSize);
    this.selectedFiles = this.selectedFiles.filter(
      (e) =>
        e.lastModified !== event.file.lastModified && e.name !== event.file.name
    );
    this.onSelectEmitter.emit(this.selectedFiles);
  }

  onClear() {
    // console.log('==========onClear : ');
    this.onSelectEmitter.emit([]);
  }

  deleteAttachFile(file: any) {
    this.onDeleteEmitter.emit(file);
    this.uploadedFiles = this.uploadedFiles.filter((res) => res != file);
  }
}
