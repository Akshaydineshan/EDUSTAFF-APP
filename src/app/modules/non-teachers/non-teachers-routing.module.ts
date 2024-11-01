import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NonTeacherListComponent } from './non-teacher-list.component';
import { PageNotFoundComponent } from 'src/app/shared/components/page-not-found/page-not-found.component';
import { AddNonTeacherComponent } from './add-non-teacher/add-non-teacher.component';
import { ViewNonTeacherDetailsComponent } from './view-non-teacher-details/view-non-teacher-details.component';

const routes: Routes = [
  { path: '', component: NonTeacherListComponent },
  { path: 'non-teacher-list', component: NonTeacherListComponent },
  { path: 'add', component: AddNonTeacherComponent },
  { path: 'add/:id', component: AddNonTeacherComponent },
  { path: 'add', component: AddNonTeacherComponent },
  { path: 'view/:id', component: ViewNonTeacherDetailsComponent},
  { 
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NonTeachersRoutingModule { }
