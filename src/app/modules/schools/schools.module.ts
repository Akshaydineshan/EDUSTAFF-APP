import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchoolsRoutingModule } from './schools-routing.module';
import { SchoolListComponent } from './school-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PromotionEligibleListComponent } from './promotion-eligible-list/promotion-eligible-list.component';

@NgModule({
  declarations: [
    SchoolListComponent,
    PromotionEligibleListComponent
  ],
  imports: [
    CommonModule,
    SchoolsRoutingModule,
    SharedModule
  ]
})
export class SchoolsModule { }
