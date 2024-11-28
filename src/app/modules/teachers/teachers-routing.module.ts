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

const routes: Routes = [
  { path: '', component: TeacherListComponent },
  { path: 'teacher-list', component: TeacherListComponent },
  { path: 'transfer-request-list', component: TransferRequestListComponent },
  { path: 'leave', component: LeaveRequestListComponent },
  { path: 'promotion-requests', component: PromotionRequestComponent },
  { path: 'eligible-promotions', component: PromotionEligibleListComponent },
  { path: 'add-teacher', component: AddTeacherComponent },
  { path: 'add-teacher/:id', component: AddTeacherComponent },
  { path: 'teacher-details', component: TeacherDetailsComponent },
  { path: 'view-teacher/:id', component: TeacherViewComponent },
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
