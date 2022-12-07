import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MessageService } from 'primeng-lts/api';
import { AutoCompleteModule } from 'primeng-lts/autocomplete';
import { BlockUIModule } from 'primeng-lts/blockui';
import { BreadcrumbModule } from 'primeng-lts/breadcrumb';
import { ButtonModule } from 'primeng-lts/button';
import { CalendarModule } from 'primeng-lts/calendar';
import { CheckboxModule } from 'primeng-lts/checkbox';
import { ConfirmDialogModule } from 'primeng-lts/confirmdialog';
import { DialogModule } from 'primeng-lts/dialog';
import { FileUploadModule } from 'primeng-lts/fileupload';
import { InputTextModule } from 'primeng-lts/inputtext';
import { InputTextareaModule } from 'primeng-lts/inputtextarea';
import { ListboxModule } from 'primeng-lts/listbox';
import { MegaMenuModule } from 'primeng-lts/megamenu';
import { PanelModule } from 'primeng-lts/panel';
import { PaginatorModule } from 'primeng-lts/paginator';
import { PickListModule } from 'primeng-lts/picklist';
import { ProgressSpinnerModule } from 'primeng-lts/progressspinner';
import { RadioButtonModule } from 'primeng-lts/radiobutton';
import { TableModule } from 'primeng-lts/table';
import { ToastModule } from 'primeng-lts/toast';
import { MultiSelectModule } from 'primeng-lts/multiselect';
import { AlertMessageComponent } from './alert-message/alert-message.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
// import { FileUploadComponent } from './file-upload/file-upload.component';
import { OverlaySpinnerComponent } from './overlay-spinner/overlay-spinner.component';
// import { PickListComponent } from './pick-list/pick-list.component';
import { SpinnerComponent } from './spinner/spinner.component';
// import { TableFindComponent } from './table-find/table-find.component';
// import { BlockableDivComponent } from './blockable-div/blockable-div.component';
// import { CauseModalComponent } from './modal/cause-modal/cause-modal.component';
// import { ProvinceModalComponent } from './modal/province-modal/province-modal.component';
// import { DistrictModalComponent } from './modal/district-modal/district-modal.component';
// import { AddServiceSymptomModalComponent } from './modal/add-service-symptom-modal/add-service-symptom-modal.component';
// import { CustomerImpactModalComponent } from './modal/customer-impact-modal/customer-impact-modal.component';
// import { ReferenceToOtherNinModalComponent } from './modal/reference-to-other-nin-modal/reference-to-other-nin-modal.component';
// import { SmsSentToModalComponent } from './modal/sms-sent-to-modal/sms-sent-to-modal.component';
// import { SmsGroupComponent } from './modal/sms-group/sms-group.component';
// import { SelectModalComponent } from './modal/select-modal/select-modal.component';
// import { TeamOfAssignToComponent } from './modal/team-of-assign-to/team-of-assign-to.component';
// import { JbSpanCodeComponent } from './modal/jb-span-code/jb-span-code.component';
// import { SelectContactComponent } from './modal/select-contact/select-contact.component';
// import { JobEmailComponent } from './modal/job-email/job-email.component';
// import { JobSmsComponent } from './modal/job-sms/job-sms.component';
// import { SiteAccessModalComponent } from './modal/site-access-modal/site-access-modal.component';
// import { QuerySiteCodeComponent } from './modal/query-site-code/query-site-code.component';
// import { ImportDataSaComponent } from './modal/import-data-sa/import-data-sa.component';
// import { CpDetailAddNoteComponent } from './cp-detail-add-note/cp-detail-add-note.component';
// import { StaffModalComponent } from './staff-modal/staff-modal.component';
// import { TableSelectionComponent } from './table-selection/table-selection.component';
// import { RelateActivityComponent } from './modal/relate-activity/relate-activity.component';
// import { FileUploadReportComponent } from './file-upload-report/file-upload-report.component';
// import { ReferenceJobModalComponent } from './modal/reference-job-modal/reference-job-modal.component';
import { TitleModalComponent } from './modal/title-modal/title-modal.component';
// import { FavProblemCauseModalComponent } from './modal/fav-problem-cause-modal/fav-problem-cause-modal.component';
// import { SiteAccessPicklistComponent } from './modal/site-access-modal/site-access-picklist/site-access-picklist.component';
// import { SendSmsPicklistComponent } from './modal/sms-group/send-sms-picklist/send-sms-picklist.component';
// import { JobEmailSmsPicklistComponent } from './modal/job-email/job-email-sms-picklist/job-email-sms-picklist.component';
// import { SiteAccessModalJobViewComponent } from './modal/site-access-job-view-modal/site-access-job-view-modal.component';
// import { SiteAccessModalJobView } from './modal/site-access-job-view-modal/site-access-job-view-list/site-access-job-view.component';
// import { NotificationsBoxComponent } from './notifications-box/notifications-box.component';
// import { AlarmActiveModalComponent } from './modal/alarm-active-modal/alarm-active-modal.component';
// import { ServiceSymptomModalComponent } from './modal/service-symptom-modal/service-symptom-modal.component';
// import { ChangeSymptomModalComponent } from './modal/change-symptom-modal/change-symptom-modal.component';
// import { ListboxModalComponent } from './modal/listbox-modal/listbox-modal.component';
// import { DnaModalComponent } from './modal/dna-modal/dna-modal.component';
import { BreadcrumbCustomComponent } from './breadcrumb-custom/breadcrumb-custom.component';
import { FileUploadWrComponent } from './file-upload-wr/file-upload-wr.component';
import { DirectiveModule } from './directive/directive.module';

@NgModule({
  declarations: [
    // TableFindComponent,
    // PickListComponent,
    AlertMessageComponent,
    // FileUploadComponent,
    SpinnerComponent,
    OverlaySpinnerComponent,
    BreadcrumbComponent,
    // BlockableDivComponent,
    // CauseModalComponent,
    // ProvinceModalComponent,
    // DistrictModalComponent,
    // AddServiceSymptomModalComponent,
    // CustomerImpactModalComponent,
    // ReferenceToOtherNinModalComponent,
    // SmsSentToModalComponent,
    // SmsGroupComponent,
    // SelectModalComponent,
    // TeamOfAssignToComponent,
    // JbSpanCodeComponent,
    // SelectContactComponent,
    // JobEmailComponent,
    // JobSmsComponent,
    // SiteAccessModalComponent,
    // SiteAccessModalJobViewComponent,
    // SiteAccessModalJobView,
    // QuerySiteCodeComponent,
    // ImportDataSaComponent,
    // CpDetailAddNoteComponent,
    // StaffModalComponent,
    // TableSelectionComponent,
    // RelateActivityComponent,
    // FileUploadReportComponent,
    // ReferenceJobModalComponent,
    TitleModalComponent,
    // FavProblemCauseModalComponent,
    // SiteAccessPicklistComponent,
    // SendSmsPicklistComponent,
    // JobEmailSmsPicklistComponent,
    // NotificationsBoxComponent,
    // AlarmActiveModalComponent,
    // ServiceSymptomModalComponent,
    // ChangeSymptomModalComponent,
    // ListboxModalComponent,
    // DnaModalComponent,
    BreadcrumbCustomComponent,
    FileUploadWrComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    MegaMenuModule,
    ButtonModule,
    FontAwesomeModule,
    InputTextModule,
    AutoCompleteModule,
    PaginatorModule,
    TableModule,
    RadioButtonModule,
    InputTextareaModule,
    CalendarModule,
    CheckboxModule,
    FileUploadModule,
    ListboxModule,
    DialogModule,
    ToastModule,
    PickListModule,
    ConfirmDialogModule,
    BlockUIModule,
    ProgressSpinnerModule,
    BreadcrumbModule,
    PanelModule,
    MultiSelectModule,
    DirectiveModule,
  ],
  exports: [
    // TableFindComponent,
    // PickListComponent,
    AlertMessageComponent,
    // FileUploadComponent,
    SpinnerComponent,
    OverlaySpinnerComponent,
    BreadcrumbComponent,
    // BlockableDivComponent,
    // CauseModalComponent,
    // ProvinceModalComponent,
    // DistrictModalComponent,
    // AddServiceSymptomModalComponent,
    // CustomerImpactModalComponent,
    // ReferenceToOtherNinModalComponent,
    // SmsSentToModalComponent,
    // SmsGroupComponent,
    // SelectModalComponent,
    // TeamOfAssignToComponent,
    // JbSpanCodeComponent,
    // SelectContactComponent,
    // JobEmailComponent,
    // JobSmsComponent,
    // SiteAccessModalComponent,
    // SiteAccessModalJobViewComponent,
    // SiteAccessModalJobView,
    // QuerySiteCodeComponent,
    // CpDetailAddNoteComponent,
    // FileUploadReportComponent,
    // ReferenceJobModalComponent,
    TitleModalComponent,
    // FavProblemCauseModalComponent,
    // StaffModalComponent,
    // TableSelectionComponent,
    // NotificationsBoxComponent,
    // AlarmActiveModalComponent,
    // ServiceSymptomModalComponent,
    // ChangeSymptomModalComponent,
    // ListboxModalComponent,
    // DnaModalComponent
    FileUploadWrComponent,
  ],
  providers: [MessageService],
})
export class ComponentModule {}
