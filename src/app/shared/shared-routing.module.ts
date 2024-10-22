import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('../auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('../modules/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'teachers',
    loadChildren: () => import('../modules/teachers/teachers.module').then(m => m.TeachersModule)
  },
  {
    path: 'schools',
    loadChildren: () => import('../modules/schools/schools.module').then(m => m.SchoolsModule)
  },
  {
    path: 'non-teachers',
    loadChildren: () => import('../modules/non-teachers/non-teachers.module').then(m => m.NonTeachersModule)
  },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule { }
