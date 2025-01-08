import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileDetailsEditComponent } from './profile-details-edit/profile-details-edit.component';


@NgModule({
  declarations: [
    ViewProfileComponent,
    EditProfileComponent,
    ProfileDetailsEditComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports:[ProfileDetailsEditComponent]
})
export class ProfileModule { }
