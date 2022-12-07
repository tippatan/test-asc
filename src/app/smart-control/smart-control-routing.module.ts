import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import * as Constants from '../utils/constants';
import { ActivityDetailTbbComponent } from './activity-detail-tbb/activity-detail-tbb.component';
import { ActivityDetailComponent } from './activity-detail/activity-detail.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SmartCheckComponent } from './smart-check/smart-check.component';
import { SmartControlComponent } from './smart-control.component';

const routes: Routes = [
  {
    path: '',
    component: SmartControlComponent,
    children: [
      {
        path: '',
        redirectTo: Constants.PATH.DASHBOARD,
      },
      {
        path: Constants.PATH.DASHBOARD,
        component: DashboardComponent,
      },
      {
        path: Constants.PATH.SMART_CHECK,
        component: SmartCheckComponent,
      },
      {
        path: Constants.PATH.ACTIVITY_DETAIL,
        component: ActivityDetailComponent,
      },{
        path: Constants.PATH.ACTIVITY_DETAIL_TBB,
        component: ActivityDetailTbbComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SmartControlRoutingModule {}
