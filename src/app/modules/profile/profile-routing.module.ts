import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AuthGuard } from 'src/app/core/gurads/auth.guard';

const routes: Routes = [
  { path: '', component: ViewProfileComponent ,  canActivate: [AuthGuard]},
  { path: 'view', component: ViewProfileComponent,  canActivate: [AuthGuard] },
  { path: 'edit', component: EditProfileComponent ,  canActivate: [AuthGuard]},
  { path: 'reset-password/:token', component: ForgotPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
