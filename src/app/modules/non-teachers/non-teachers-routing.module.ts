import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NonTeacherListComponent } from './non-teacher-list.component';
import { PageNotFoundComponent } from 'src/app/shared/components/page-not-found/page-not-found.component';
import { AddNonTeacherComponent } from './add-non-teacher/add-non-teacher.component';
import { ViewNonTeacherDetailsComponent } from './view-non-teacher-details/view-non-teacher-details.component';
import { TransferRequestListComponent } from '../teachers/transfer-request-list/transfer-request-list.component';
import { NonTeacherTransferlistComponent } from './non-teacher-transferlist/non-teacher-transferlist.component';
import { StaffLeaveApplicationsComponent } from './staff-leave-applications/staff-leave-applications.component';
import { StaffTransferCompletedListComponent } from './staff-transfer-completed-list/staff-transfer-completed-list.component';
import { RetiredStaffComponent } from './retired-staff/retired-staff.component';

const routes: Routes = [
  { path: '', component: NonTeacherListComponent },
  { path: 'non-teacher-list', component: NonTeacherListComponent },
  { path: 'add', component: AddNonTeacherComponent },
  { path: 'add/:id', component: AddNonTeacherComponent },
  { path: 'add', component: AddNonTeacherComponent },
  { path: 'view/:id', component: ViewNonTeacherDetailsComponent},
  { path: 'transfer-request', component:NonTeacherTransferlistComponent },
  { path: 'leave', component:StaffLeaveApplicationsComponent },
  { path: 'transfer-completed', component:StaffTransferCompletedListComponent },
  { path: 'retired-staff', component:RetiredStaffComponent },
  
  { 
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NonTeachersRoutingModule { }
