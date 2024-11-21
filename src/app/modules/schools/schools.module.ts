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

@NgModule({
  declarations: [
    SchoolListComponent,
    PromotionEligibleListComponent,
    AddSchoolComponent,
    ViewSchoolComponent,
    SchoolVacantPositionsComponent
  ],
  imports: [
    CommonModule,
    SchoolsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SchoolsModule { }
