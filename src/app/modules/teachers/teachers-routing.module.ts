import { PromotionRelinquishmentComponent } from './promotion-relinquishment/promotion-relinquishment.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherListComponent } from './teacher-list.component';
import { PageNotFoundComponent } from 'src/app/shared/components/page-not-found/page-not-found.component';
import { PromotionEligibleListComponent } from './promotion-eligible-list/promotion-eligible-list.component';
import { AddTeacherComponent } from './add-teacher/add-teacher.component';
import { TeacherDetailsComponent } from './teacher-details/teacher-details.component';
import { TeacherViewComponent } from './teacher-view/teacher-view.component';
import { TransferRequestListComponent } from './transfer-request-list/transfer-request-list.component';
import { LeaveRequestListComponent } from './leave-request-list/leave-request-list.component';
import { PromotionRequestComponent } from './promotion-request/promotion-request.component';
import { PromotionCompletedListComponent } from './promotion-completed-list/promotion-completed-list.component';
import { TransferCompletedListComponent } from './transfer-completed-list/transfer-completed-list.component';
import { RetiredTeacherListComponent } from './retired-teacher-list/retired-teacher-list.component';
import { PromotionEligiblePriorityComponent } from './promotion-eligible-priority/promotion-eligible-priority.component';
import { OnLeaveTeacherComponent } from './on-leave-teacher/on-leave-teacher.component';
import { TeacherSectionViewComponent } from './teacher-section-view/teacher-section-view.component';
import { roleGuard } from 'src/app/core/gurads/role/role.guard';
import { ApprovedNonApprovedTeacherComponent } from './approved-non-approved-teacher/approved-non-approved-teacher.component';
import { PromotionRelinquishmentListComponent } from './promotion-relinquishment/promotion-relinquishment-list/promotion-relinquishment-list.component';

const routes: Routes = [
  { path: '', component: TeacherSectionViewComponent },
  { path: 'teacher-list', component: TeacherListComponent },
  { path: 'transfer-request-list', component: TransferRequestListComponent },
  { path: 'leave', component: LeaveRequestListComponent },
  { path: 'promotion-requests', component: PromotionRequestComponent },
  { path: 'eligible-promotions', component: PromotionEligibleListComponent },
  { path: 'add-teacher', component: AddTeacherComponent,canActivate:[roleGuard] },
  { path: 'add-teacher/:id', component: AddTeacherComponent,canActivate:[roleGuard] },
  { path: 'teacher-details', component: TeacherDetailsComponent },
  { path: 'view-teacher/:id', component: TeacherViewComponent },
  { path: 'promotion-completed', component: PromotionCompletedListComponent },
  { path: 'transfer-completed', component: TransferCompletedListComponent },
  { path: 'retired-teachers', component: RetiredTeacherListComponent },
  { path: 'promotion-priorities', component: PromotionEligiblePriorityComponent },
  { path: 'onleave', component: OnLeaveTeacherComponent },
  {path:'Promotion-relinquishment',component:PromotionRelinquishmentListComponent},
  {path:'Promotion-relinquishment/create',component:PromotionRelinquishmentComponent},
  {path:'by-approve',component:ApprovedNonApprovedTeacherComponent},
  { 
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeachersRoutingModule { }
