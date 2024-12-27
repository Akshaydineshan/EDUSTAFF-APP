import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from '../layout/topbar/topbar.component';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';
import { SharedRoutingModule } from './shared-routing.module';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { TableListComponent } from './components/table-list/table-list.component';
import { FilterDialogComponent } from './components/filter-dialog/filter-dialog.component';
import { DetailDailogComponent } from './components/detail-dailog/detail-dailog.component';
import { TableComponent } from './components/table/table.component';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';


import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { MaterialSpinnerComponent } from './material-spinner/material-spinner.component';
import { AlertComponent } from './components/alerts/alert/alert.component';
import { ToastrModule } from 'ngx-toastr';
import { EmployeeHoverPopupComponent } from './components/employee-hover-popup/employee-hover-popup.component';
import { SchoolHoverPopupComponent } from './components/school-hover-popup/school-hover-popup.component';
import { TeacherTableNameSectionComponent } from './components/teacher-table-name-section/teacher-table-name-section.component';
import { EmployeeMenuClickListMenuComponent } from './components/employee-menu-click-list-menu/employee-menu-click-list-menu.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BackButtonComponent } from './components/back-button/back-button.component';
import { NoDataFoundComponent } from './components/no-data-found/no-data-found.component';
import { RomanPipe } from './pipes/roman.pipe';


@NgModule({
  declarations: [
    TopbarComponent,
    SidebarComponent,
    PageNotFoundComponent,
    TableListComponent,
    FilterDialogComponent,
    DetailDailogComponent,
    TableComponent,
    MaterialSpinnerComponent,
    AlertComponent,
    EmployeeHoverPopupComponent,
    SchoolHoverPopupComponent,
    TeacherTableNameSectionComponent,
    EmployeeMenuClickListMenuComponent,
    BackButtonComponent,
    NoDataFoundComponent,
    RomanPipe
    
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    AgGridModule,
    
   
    MatProgressSpinnerModule,
    ToastrModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot()
  ],
  exports: [
    TopbarComponent,
    SidebarComponent,
    TableListComponent,
    DetailDailogComponent,
    TableComponent,
    MaterialSpinnerComponent,
    EmployeeHoverPopupComponent,
    SchoolHoverPopupComponent,
    TeacherTableNameSectionComponent,
    EmployeeMenuClickListMenuComponent,
    AgGridModule,
    NgMultiSelectDropDownModule,
    BackButtonComponent,
    NoDataFoundComponent,
    RomanPipe
  ]
})
export class SharedModule { }
