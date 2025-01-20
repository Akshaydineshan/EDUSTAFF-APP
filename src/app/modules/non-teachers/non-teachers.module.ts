import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NonTeachersRoutingModule } from './non-teachers-routing.module';
import { NonTeacherListComponent } from './non-teacher-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddNonTeacherComponent } from './add-non-teacher/add-non-teacher.component';
import { NonTeacherPersonalDetailsComponent } from './add-non-teacher/non-teacher-personal-details/non-teacher-personal-details.component';
import { NonTeacherEducationDetailsComponent } from './add-non-teacher/non-teacher-education-details/non-teacher-education-details.component';
import { NonTeacherProfessionalDetailsComponent } from './add-non-teacher/non-teacher-professional-details/non-teacher-professional-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddNonTeacherPreviewComponent } from './add-non-teacher/add-non-teacher-preview/add-non-teacher-preview.component';
import { ViewNonTeacherDetailsComponent } from './view-non-teacher-details/view-non-teacher-details.component';
import { NonTeacherTransferlistComponent } from './non-teacher-transferlist/non-teacher-transferlist.component';
import { StaffLeaveApplicationsComponent } from './staff-leave-applications/staff-leave-applications.component';
import { StaffTransferCompletedListComponent } from './staff-transfer-completed-list/staff-transfer-completed-list.component';
import { NgxDaterangepickerBootstrapModule } from 'ngx-daterangepicker-bootstrap';
import { TeachersModule } from '../teachers/teachers.module';
import { RetiredStaffComponent } from './retired-staff/retired-staff.component';
import { OnLeaveStaffComponent } from './on-leave-staff/on-leave-staff.component';
import { StaffSectionViewComponent } from './staff-section-view/staff-section-view.component';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  declarations: [
    NonTeacherListComponent,
    AddNonTeacherComponent,
    NonTeacherPersonalDetailsComponent,
    NonTeacherEducationDetailsComponent,
    NonTeacherProfessionalDetailsComponent,
    AddNonTeacherPreviewComponent,
    ViewNonTeacherDetailsComponent,
    NonTeacherTransferlistComponent,
    StaffLeaveApplicationsComponent,
    StaffTransferCompletedListComponent,
    RetiredStaffComponent,
    OnLeaveStaffComponent,
    StaffSectionViewComponent
  ],
  imports: [
    CommonModule,
    NonTeachersRoutingModule,
    TeachersModule,
    SharedModule,
    FormsModule,
    CoreModule,
    ReactiveFormsModule,
    NgxDaterangepickerBootstrapModule.forRoot()
  ]
})
export class NonTeachersModule { }
