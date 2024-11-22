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

@NgModule({
  declarations: [
    SchoolListComponent,
    PromotionEligibleListComponent,
    AddSchoolComponent,
    ViewSchoolComponent,
    SchoolVacantPositionsComponent,
    TestDemoComponent
  ],
  imports: [
    CommonModule,
    SchoolsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class SchoolsModule { }
