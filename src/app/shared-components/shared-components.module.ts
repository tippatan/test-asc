import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTable2Component } from './data-table2/data-table2/data-table2.component';
import { NumberOnlyDirective } from './number/number-only.directive';
import { PaginatorComponent } from './data-table2/paginator/paginator.component';
import { ActionIconComponent } from './data-table2/component/action-icon.component';
import { ActDetailAlarmTblComponent } from './data-table2/component/smart-control/act-detail-alarm-tbl/act-detail-alarm-tbl.component';
import { ActDetailEnterpriseTblComponent } from './data-table2/component/smart-control/act-detail-enterprise-tbl/act-detail-enterprise-tbl.component';
import { ActDetailFbbTblComponent } from './data-table2/component/smart-control/act-detail-fbb-tbl/act-detail-fbb-tbl.component';
import { ActDetailWorkerTblComponent } from './data-table2/component/smart-control/act-detail-worker-tbl/act-detail-worker-tbl.component';
import { SmartCheckAlarmTblComponent } from './data-table2/component/smart-control/smart-check-alarm-tbl/smart-check-alarm-tbl.component';
import { SmartCheckEnterpriseTblComponent } from './data-table2/component/smart-control/smart-check-enterprise-tbl/smart-check-enterprise-tbl.component';
import { SmartCheckFbbTblComponent } from './data-table2/component/smart-control/smart-check-fbb-tbl/smart-check-fbb-tbl.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CheckboxModule } from 'primeng-lts/checkbox';
import { DialogModule } from 'primeng-lts/dialog';
import { ActDetailFbbTbbTblComponent } from './data-table2/component/smart-control/act-detail-fbb-tbb-tbl/act-detail-fbb-tbb-tbl.component';
import { MatButtonModule } from '@angular/material/button';
import { ButtonModule } from 'primeng-lts/button';
import { CustomerAsteriskPipe } from 'app/helpers/pipes/customer-asterisk.pipe';
@NgModule({
  declarations: [
    DataTable2Component,
    NumberOnlyDirective,
    PaginatorComponent,
    ActionIconComponent,
    ActDetailAlarmTblComponent,
    ActDetailEnterpriseTblComponent,
    ActDetailFbbTblComponent,
    ActDetailWorkerTblComponent,
    SmartCheckAlarmTblComponent,
    SmartCheckEnterpriseTblComponent,
    SmartCheckFbbTblComponent,
    ActDetailFbbTbbTblComponent,
    CustomerAsteriskPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatButtonModule,
    CheckboxModule,
    DialogModule,
    ButtonModule,
  ],
  exports: [DataTable2Component],
})
export class SharedComponentsModule {}
