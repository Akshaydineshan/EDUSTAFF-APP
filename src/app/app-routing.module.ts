import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/gurads/auth.guard';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    canActivate: [AuthGuard],
    path: 'dashboard',
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    canActivate: [AuthGuard],
    path: 'teachers',
    loadChildren: () => import('./modules/teachers/teachers.module').then(m => m.TeachersModule)
  },
  {
    canActivate: [AuthGuard],
    path: 'schools',
    loadChildren: () => import('./modules/schools/schools.module').then(m => m.SchoolsModule)
  },
  {
    canActivate: [AuthGuard],
    path: 'non-teachers',
    loadChildren: () => import('./modules/non-teachers/non-teachers.module').then(m => m.NonTeachersModule)
  },
  {
    canActivate: [AuthGuard],
    path: 'profile',
    loadChildren: () => import('./modules/profile/profile.module').then(m => m.ProfileModule)
  },
  {
    canActivate: [AuthGuard],
    path: 'settings',
    loadChildren: () => import('./modules/settings/settings.module').then(m => m.SettingsModule)
  },
  { 
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
