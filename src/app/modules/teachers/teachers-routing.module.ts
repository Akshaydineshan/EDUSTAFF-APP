import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherListComponent } from './teacher-list.component';
import { PageNotFoundComponent } from 'src/app/shared/components/page-not-found/page-not-found.component';
import { PromotionEligibleListComponent } from './promotion-eligible-list/promotion-eligible-list.component';
import { AddTeacherComponent } from './add-teacher/add-teacher.component';
import { TeacherDetailsComponent } from './teacher-details/teacher-details.component';

const routes: Routes = [
  { path: '', component: TeacherListComponent },
  { path: 'teacher-list', component: TeacherListComponent },
  { path: 'eligible-promotions', component: PromotionEligibleListComponent },
  { path: 'add-teacher', component: AddTeacherComponent },
  { path: 'add-teacher/:id', component: AddTeacherComponent },
  { path: 'teacher-details', component: TeacherDetailsComponent },
  { 
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeachersRoutingModule { }
