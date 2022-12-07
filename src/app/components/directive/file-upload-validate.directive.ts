import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { FileUpload } from 'primeng-lts/fileupload';

@Directive({
  selector: '[appFileUploadValidate]',
})
export class FileUploadValidateDirective {
  @Input() totalFileSize = 0;
  @Input() uploadedFiles : any[] = [];
  @Input() selectedFiles : any[] = [];
  totalFileSizeTemp = 0;

  constructor(private el: ElementRef, private fileUpload: FileUpload) {
    // console.log('FileUploadValidateDirective constructor : ',fileUpload);
    this.totalFileSizeTemp = 0;
    this.fileUpload.validate = (file: File) => {
      console.log('FileUploadValidateDirective file : ',file, this.uploadedFiles, this.selectedFiles,this.totalFileSizeTemp);
      console.log(this.totalFileSize);
      if (this.fileUpload.accept && !this.isFileTypeValid(file)) {
        this.fileUpload.msgs.push({
          severity: 'error',
          summary: this.fileUpload.invalidFileTypeMessageSummary.replace(
            '{0}',
            file.name
          ),
          detail: this.fileUpload.invalidFileTypeMessageDetail.replace(
            '{0}',
            this.fileUpload.accept
          ),
        });
        return false;
      }

      if (
        this.fileUpload.maxFileSize &&
        file.size > this.fileUpload.maxFileSize
      ) {
        this.fileUpload.msgs.push({
          severity: 'error',
          summary: this.fileUpload.invalidFileSizeMessageSummary.replace(
            '{0}',
            file.name
          ),
          detail: this.fileUpload.invalidFileSizeMessageDetail.replace(
            '{0}',
            this.fileUpload.formatSize(this.fileUpload.maxFileSize)
          ),
        });
        return false;
      }
      let fileName = file.name;
      const pattern = /^[a-zA-Z0-9._-\s()]*$/;
      let matches = fileName.match(pattern);
      if (!matches) {
        this.fileUpload.msgs.push({
          severity: 'error',
          summary: fileName,
          detail: 'File name must be English only',
        });
        return false;
      }
        // let fileName = file.name;
      // const pattern = /^[a-zA-Z0-9._-\s()]*$/;
      let duplicateFiles = this.uploadedFiles.filter(
        (res) => res.name === fileName || res.fileName === fileName
      );
      console.log('FileUploadValidateDirective duplicateFiles : ',duplicateFiles);
      if (duplicateFiles && duplicateFiles.length > 0) {
        this.fileUpload.msgs.push({
          severity: 'error',
          summary: fileName + '',
          detail:
            ' Duplicate File name '
        });
        return false;
      }

      
      let selectedFileSize = this.selectedFiles.reduce((accumulator, object) => {
        return accumulator + object.size;
      }, 0);

      console.log('-------- totalFileSize : ',this.totalFileSize, selectedFileSize, this.totalFileSizeTemp, file.size);

      if (this.totalFileSize + selectedFileSize + this.totalFileSizeTemp + file.size > 10000000) {
        this.fileUpload.msgs.push({
          severity: 'error',
          summary: fileName + '',
          detail:
            'total file size: ' +
            (this.totalFileSize + selectedFileSize + this.totalFileSizeTemp + file.size) +
            ' Byte. total Files size must not larger than 10 MB.(10000000 Byte) ',
        });
        return false;
      } else {
        this.totalFileSizeTemp += file.size;
      }
      console.log('validate return');
      return true;
    };

    // this.fileUpload.onFileSelect = (event: any) => {
    //   console.log(' this.fileUpload.onFileSelect event : ',event);
    // }
    // this.fileUpload.isFileSelected = (file: File) => {
    //   console.log(' this.fileUpload.isFileSelected  file :  ',file);
    //   return true;
    // }

    // this.fileUpload.remove = (event: any, index: number) => {
    //   console.log(' this.fileUpload.remove event index : ',event,index);
    //   console.log('==========onRemove : ',event, this.totalFileSize);
    //   this.selectedFiles = this.selectedFiles.filter(
    //     (e) =>
    //       e.lastModified !== event.file.lastModified && e.name !== event.file.name
    //   );
    // }
    this.fileUpload.onBlur = () => {
      console.log('==========onBlur : ');
      this.totalFileSizeTemp= 0;
    }
    console.log('end return');
  }

  isFileTypeValid(file: File): boolean {
    let acceptableTypes = this.fileUpload.accept
      .split(',')
      .map((type) => type.trim());
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
}
