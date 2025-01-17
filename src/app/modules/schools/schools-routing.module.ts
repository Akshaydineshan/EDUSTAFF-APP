import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchoolListComponent } from './school-list.component';
import { PageNotFoundComponent } from 'src/app/shared/components/page-not-found/page-not-found.component';
import { PromotionEligibleListComponent } from './promotion-eligible-list/promotion-eligible-list.component';
import { AddSchoolComponent } from './add-school/add-school.component';
import { ViewSchoolComponent } from './view-school/view-school.component';
import { SchoolVacantPositionsComponent } from './school-vacant-positions/school-vacant-positions.component';
import { TestDemoComponent } from './test-demo/test-demo.component';
import { SchoolwiseTeacherListComponent } from './schoolwise-teacher-list/schoolwise-teacher-list.component';
import { SchoolSectionViewComponent } from './school-section-view/school-section-view.component';
import { VacantPositionAddComponent } from './vacant-position-add/vacant-position-add.component';
import { SchoolwiceStaffListComponent } from './schoolwice-staff-list/schoolwice-staff-list.component';
import { roleGuard } from 'src/app/core/gurads/role/role.guard';
import { AuthoritiesListComponent } from './authorities-list/authorities-list.component';

const routes: Routes = [
  { path: '', component: SchoolSectionViewComponent },
  { path: 'school-list', component: SchoolListComponent },
  { path: 'demo', component: TestDemoComponent },
  { path: 'vacant-positions', component: SchoolVacantPositionsComponent },
  { path: 'add-school', component: AddSchoolComponent ,canActivate:[roleGuard]},
  { path: 'add-school/:id', component: AddSchoolComponent,canActivate:[roleGuard] },
  { path: 'view/:id', component: ViewSchoolComponent },
  { path: 'eligible-promotions', component: PromotionEligibleListComponent },
  { path: 'teacher-list', component: SchoolwiseTeacherListComponent },
  { path: 'staff-list', component: SchoolwiceStaffListComponent },
  { path: 'vacant-position-add', component:VacantPositionAddComponent ,canActivate:[roleGuard] },
  { path: 'authority-list', component: AuthoritiesListComponent },
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