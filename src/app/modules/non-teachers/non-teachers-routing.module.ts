import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NonTeacherListComponent } from './non-teacher-list.component';
import { PageNotFoundComponent } from 'src/app/shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', component: NonTeacherListComponent },
  { path: 'non-teacher-list', component: NonTeacherListComponent },
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
