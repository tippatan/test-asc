import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng-lts/table';
import { FileUploadValidateDirective } from './file-upload-validate.directive';

@NgModule({
    declarations: [
      FileUploadValidateDirective,
    ],
    imports: [CommonModule, TableModule],
    exports: [
      FileUploadValidateDirective,
    ],
  })
  export class DirectiveModule {}
  