import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmartControlRoutingModule } from './smart-control-routing.module';
import { ActivityDetailComponent } from './activity-detail/activity-detail.component';
import { DetailComponent } from './activity-detail/detail/detail.component';
import { ServiceComponent } from './activity-detail/service/service.component';
import { AlarmComponent } from './activity-detail/alarm/alarm.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SmartCheckComponent } from './smart-check/smart-check.component';
import { ServiceEnterpriseComponent } from './activity-detail/service-enterprise/service-enterprise.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MegaMenuModule } from 'primeng-lts/megamenu';
import { ButtonModule } from 'primeng-lts/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TableModule } from 'primeng-lts/table';
import { InputTextModule } from 'primeng-lts/inputtext';
import { PanelModule } from 'primeng-lts/panel';
import { AutoCompleteModule } from 'primeng-lts/autocomplete';
import { PaginatorModule } from 'primeng-lts/paginator';
import { InputTextareaModule } from 'primeng-lts/inputtextarea';
import { CalendarModule } from 'primeng-lts/calendar';
import { CheckboxModule } from 'primeng-lts/checkbox';
import { FileUploadModule } from 'primeng-lts/fileupload';
import { ListboxModule } from 'primeng-lts/listbox';
import { DialogModule } from 'primeng-lts/dialog';
import { ComponentModule } from '../components/component.module';
import { MessagesModule } from 'primeng-lts/messages';
import { MessageModule } from 'primeng-lts/message';
import { DropdownModule } from 'primeng-lts/dropdown';
import { BlockUIModule } from 'primeng-lts/blockui';
import { ConfirmDialogModule } from 'primeng-lts/confirmdialog';
import { MultiSelectModule } from 'primeng-lts/multiselect';
import { RadioButtonModule } from 'primeng-lts/radiobutton';
import { ProgressSpinnerModule } from 'primeng-lts/progressspinner';
import { ToastModule } from 'primeng-lts/toast';
import { SmartControlComponent } from './smart-control.component';
import { ChartModule } from 'primeng-lts/chart';
import { SelectButtonModule } from 'primeng-lts/selectbutton';
import { TabViewModule } from 'primeng-lts/tabview';
import { ServiceFbbComponent } from './activity-detail/service-fbb/service-fbb.component';
import { ScrollPanelModule } from 'primeng-lts/scrollpanel';
import { CardModule } from 'primeng-lts/card';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedComponentsModule } from 'app/shared-components/shared-components.module';
import { UserFilterDialogComponent } from './shares/component/user-filter-dialog/user-filter-dialog.component';
import { SmartcontrolConfirmDialogComponent } from './shares/component/smartcontrol-confirm-dialog/smartcontrol-confirm-dialog.component';
import { OverlayPanelModule } from 'primeng-lts/overlaypanel';
import { NotiTabComponent } from './notification/noti-tab/noti-tab.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { TimelineHorizontalComponent } from './shares/component/timeline-horizontal/timeline-horizontal.component';
import { ActivityDetailTbbComponent } from './activity-detail-tbb/activity-detail-tbb.component';
import { ChipsModule } from 'primeng-lts/chips';
@NgModule({
  declarations: [
    SmartControlComponent,
    DashboardComponent,
    SmartCheckComponent,
    ActivityDetailComponent,
    DetailComponent,
    ServiceComponent,
    AlarmComponent,
    ServiceEnterpriseComponent,
    ServiceFbbComponent,
    UserFilterDialogComponent,
    SmartcontrolConfirmDialogComponent,
    NotiTabComponent,
    UserProfileComponent,
    TimelineHorizontalComponent,
    ActivityDetailTbbComponent,
  ],
  imports: [
    CommonModule,
    SmartControlRoutingModule,
    SharedComponentsModule,
    FormsModule,
    HttpClientModule,
    MegaMenuModule,
    ButtonModule,
    FontAwesomeModule,
    InputTextModule,
    PanelModule,
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
    ComponentModule,
    MessagesModule,
    MessageModule,
    ReactiveFormsModule,
    DropdownModule,
    ProgressSpinnerModule,
    BlockUIModule,
    MultiSelectModule,
    ConfirmDialogModule,
    ToastModule,
    ChartModule,
    SelectButtonModule,
    TabViewModule,
    ScrollPanelModule,
    CardModule,
    MatCardModule,
    MatTooltipModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatTabsModule,
    OverlayPanelModule,
    ChipsModule,
  ],
})
export class SmartControlModule {}
