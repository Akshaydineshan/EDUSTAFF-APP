import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NonTeachersRoutingModule } from './non-teachers-routing.module';
import { NonTeacherListComponent } from './non-teacher-list.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    NonTeacherListComponent
  ],
  imports: [
    CommonModule,
    NonTeachersRoutingModule,
    SharedModule
  ]
})
export class NonTeachersModule { }
