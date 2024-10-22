import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeachersRoutingModule } from './teachers-routing.module';
import { TeacherListComponent } from './teacher-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PromotionEligibleListComponent } from './promotion-eligible-list/promotion-eligible-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddTeacherComponent } from './add-teacher/add-teacher.component';
import { TeacherDetailsComponent } from './teacher-details/teacher-details.component';
import { PersonalDetailsComponent } from './add-teacher/personal-details/personal-details.component';
import { EducationalDetailsComponent } from './add-teacher/educational-details/educational-details.component';
import { ProfessionalDetailsComponent } from './add-teacher/professional-details/professional-details.component';

@NgModule({
  declarations: [
    TeacherListComponent,
    PromotionEligibleListComponent,
    AddTeacherComponent,
    TeacherDetailsComponent,
    PersonalDetailsComponent,
    EducationalDetailsComponent,
    ProfessionalDetailsComponent
  ],
  imports: [
    CommonModule,
    TeachersRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TeachersModule { }
