import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchoolListComponent } from './school-list.component';
import { PageNotFoundComponent } from 'src/app/shared/components/page-not-found/page-not-found.component';
import { PromotionEligibleListComponent } from './promotion-eligible-list/promotion-eligible-list.component';
import { AddSchoolComponent } from './add-school/add-school.component';
import { ViewSchoolComponent } from './view-school/view-school.component';

const routes: Routes = [
  { path: '', component: SchoolListComponent },
  { path: 'school-list', component: SchoolListComponent },
  { path: 'add-school', component: AddSchoolComponent },
  { path: 'view/:id', component: ViewSchoolComponent },
  { path: 'eligible-promotions', component: PromotionEligibleListComponent },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchoolsRoutingModule { }