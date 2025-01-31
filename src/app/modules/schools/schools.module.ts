import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchoolsRoutingModule } from './schools-routing.module';
import { SchoolListComponent } from './school-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PromotionEligibleListComponent } from './promotion-eligible-list/promotion-eligible-list.component';
import { AddSchoolComponent } from './add-school/add-school.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewSchoolComponent } from './view-school/view-school.component';
import { SchoolVacantPositionsComponent } from './school-vacant-positions/school-vacant-positions.component';
import { TestDemoComponent } from './test-demo/test-demo.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SchoolwiseTeacherListComponent } from './schoolwise-teacher-list/schoolwise-teacher-list.component';
import { SchoolSectionViewComponent } from './school-section-view/school-section-view.component';
import { VacantPositionAddComponent } from './vacant-position-add/vacant-position-add.component';
import { SchoolwiceStaffListComponent } from './schoolwice-staff-list/schoolwice-staff-list.component';
import { CoreModule } from 'src/app/core/core.module';
import { AppRoleDirective } from 'src/app/core/directive/app-role.directive';
import { AuthoritiesListComponent } from './authorities-list/authorities-list.component';

@NgModule({
  declarations: [
    SchoolListComponent,
    PromotionEligibleListComponent,
    AddSchoolComponent,
    ViewSchoolComponent,
    SchoolVacantPositionsComponent,
    TestDemoComponent,
    SchoolwiseTeacherListComponent,
    SchoolSectionViewComponent,
    VacantPositionAddComponent,
    SchoolwiceStaffListComponent,
    AuthoritiesListComponent,
   
   
  ],
  imports: [
    CommonModule,
    SchoolsRoutingModule,
    SharedModule,
    FormsModule,
    CoreModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
  
})
export class SchoolsModule { }
