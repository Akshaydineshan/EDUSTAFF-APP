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

@NgModule({
  declarations: [
    NonTeacherListComponent,
    AddNonTeacherComponent,
    NonTeacherPersonalDetailsComponent,
    NonTeacherEducationDetailsComponent,
    NonTeacherProfessionalDetailsComponent,
    AddNonTeacherPreviewComponent,
    ViewNonTeacherDetailsComponent,
    NonTeacherTransferlistComponent
  ],
  imports: [
    CommonModule,
    NonTeachersRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class NonTeachersModule { }
