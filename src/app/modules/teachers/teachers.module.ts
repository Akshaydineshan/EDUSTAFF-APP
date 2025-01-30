import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeachersRoutingModule } from './teachers-routing.module';
import { TeacherListComponent } from './teacher-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PromotionEligibleListComponent } from './promotion-eligible-list/promotion-eligible-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddTeacherComponent } from './add-teacher/add-teacher.component';
import { TeacherDetailsComponent } from './teacher-details/teacher-details.component';
import { PersonalDetailsComponent } from './add-teacher/personal-details/personal-details.component';
import { EducationalDetailsComponent } from './add-teacher/educational-details/educational-details.component';
import { ProfessionalDetailsComponent } from './add-teacher/professional-details/professional-details.component';
import { TeacherViewComponent } from './teacher-view/teacher-view.component';
import { TransferRequestListComponent } from './transfer-request-list/transfer-request-list.component';
import { LeaveRequestListComponent } from './leave-request-list/leave-request-list.component';
import { PromotionRequestComponent } from './promotion-request/promotion-request.component';
import { PromotionCompletedListComponent } from './promotion-completed-list/promotion-completed-list.component';
import { TransferCompletedListComponent } from './transfer-completed-list/transfer-completed-list.component';
import { RetiredTeacherListComponent } from './retired-teacher-list/retired-teacher-list.component';
import { NgxDaterangepickerBootstrapModule, NgxDaterangepickerLocaleService } from 'ngx-daterangepicker-bootstrap';
import { PromotionEligiblePriorityComponent } from './promotion-eligible-priority/promotion-eligible-priority.component';
import { DocumentsUploadComponent } from './add-teacher/documents-upload/documents-upload.component';
import { OnLeaveTeacherComponent } from './on-leave-teacher/on-leave-teacher.component';
import { TeacherSectionViewComponent } from './teacher-section-view/teacher-section-view.component';
import { CoreModule } from 'src/app/core/core.module';
import { PromotionRelinquishmentComponent } from './promotion-relinquishment/promotion-relinquishment.component';
import { ApprovedNonApprovedTeacherComponent } from './approved-non-approved-teacher/approved-non-approved-teacher.component';
import { PromotionRelinquishmentListComponent } from './promotion-relinquishment/promotion-relinquishment-list/promotion-relinquishment-list.component';

@NgModule({
  declarations: [
    TeacherListComponent,
    PromotionEligibleListComponent,
    AddTeacherComponent,
    TeacherDetailsComponent,
    PersonalDetailsComponent,
    EducationalDetailsComponent,
    ProfessionalDetailsComponent,
    TeacherViewComponent,
    TransferRequestListComponent,
    LeaveRequestListComponent,
    PromotionRequestComponent,
    PromotionCompletedListComponent,
    TransferCompletedListComponent,
    RetiredTeacherListComponent,
    PromotionEligiblePriorityComponent,
    DocumentsUploadComponent,
    OnLeaveTeacherComponent,
    TeacherSectionViewComponent,
    PromotionRelinquishmentComponent,
    ApprovedNonApprovedTeacherComponent,
    PromotionRelinquishmentListComponent
  ],
  imports: [
    CommonModule,
    TeachersRoutingModule,
    SharedModule,
    FormsModule,
    CoreModule,
    ReactiveFormsModule,
    NgxDaterangepickerBootstrapModule.forRoot()
   
  ],
 
  exports:[DocumentsUploadComponent],
  providers: [NgxDaterangepickerLocaleService],
})
export class TeachersModule { }
